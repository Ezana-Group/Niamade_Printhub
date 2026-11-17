import zlib, struct, subprocess, os

def parse_png(path):
    with open(path, 'rb') as f:
        sig = f.read(8)
        idat = b''
        while True:
            head = f.read(8)
            if not head: break
            length, ctype = struct.unpack('>I4s', head)
            cdata = f.read(length)
            f.read(4)
            if ctype == b'IHDR':
                w, h, depth, colortype, comp, filt, inter = struct.unpack('>IIBBBBB', cdata)
            elif ctype == b'IDAT':
                idat += cdata
            elif ctype == b'IEND':
                break
    raw = zlib.decompress(idat)
    bpp = 4
    stride = 1 + w * bpp
    img = bytearray(w * h * 4)
    for y in range(h):
        ft = raw[y*stride]
        prev_row = img[(y-1)*w*4 : y*w*4] if y > 0 else bytes(w*4)
        curr_raw = raw[y*stride + 1 : (y+1)*stride]
        curr_row = bytearray(w*4)
        for i in range(w*4):
            x_bpp = curr_row[i - 4] if i >= 4 else 0
            p = prev_row[i]; c = prev_row[i - 4] if i >= 4 else 0
            filt_byte = curr_raw[i]
            if ft == 0: val = filt_byte
            elif ft == 1: val = (filt_byte + x_bpp) & 0xff
            elif ft == 2: val = (filt_byte + p) & 0xff
            elif ft == 3: val = (filt_byte + (x_bpp + p) // 2) & 0xff
            elif ft == 4:
                pa = abs(p - c); pb = abs(x_bpp - c); pc = abs(x_bpp + p - 2*c)
                pr = x_bpp if pa <= pb and pa <= pc else (p if pb <= pc else c)
                val = (filt_byte + pr) & 0xff
            curr_row[i] = val
        img[y*w*4 : (y+1)*w*4] = curr_row
    return w, h, img

def write_png(filename, width, height, rgba_data):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        raw.extend(rgba_data[y * width * 4 : (y + 1) * width * 4])
    idat_data = zlib.compress(bytes(raw), 9)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr_data) + chunk(b'IDAT', idat_data) + chunk(b'IEND', b'')
    with open(filename, 'wb') as f:
        f.write(png)

def crop_rgba(src_img, src_w, src_h, x1, y1, x2, y2, pad=0):
    crop_w = (x2 - x1 + 1) + 2 * pad
    crop_h = (y2 - y1 + 1) + 2 * pad
    dst = bytearray(crop_w * crop_h * 4)
    for y in range(y1, y2 + 1):
        dst_y = y - y1 + pad
        for x in range(x1, x2 + 1):
            dst_x = x - x1 + pad
            src_idx = (y * src_w + x) * 4
            dst_idx = (dst_y * crop_w + dst_x) * 4
            dst[dst_idx : dst_idx + 4] = src_img[src_idx : src_idx + 4]
    return crop_w, crop_h, dst

def make_white_version(rgba_data):
    # Changes all dark pixels to white while preserving alpha
    out = bytearray(len(rgba_data))
    for i in range(0, len(rgba_data), 4):
        a = rgba_data[i + 3]
        if a > 0:
            out[i] = 255
            out[i + 1] = 255
            out[i + 2] = 255
            out[i + 3] = a
        else:
            out[i:i+4] = (0, 0, 0, 0)
    return out

print("Parsing source assets...")
w_full, h_full, img_full = parse_png('PHLogo-V1_Export_all_black.png')
w_hex, h_hex, img_hex = parse_png('PH_Balck_Hex_Only_whiteColour.png')

# 1. Full Stacked Logo (logo.png and logo-white.png)
# Bounding box: x=(418, 2147), y=(880, 2503)
cw, ch, cropped_full = crop_rgba(img_full, w_full, h_full, 418, 880, 2147, 2503, pad=40)
write_png('public/logo.png', cw, ch, cropped_full)
write_png('public/logo-white.png', cw, ch, make_white_version(cropped_full))

# Resize logo.png and logo-white.png with sips to max dimension 1200 for web efficiency
subprocess.run(['sips', '-Z', '1200', 'public/logo.png'], check=True)
subprocess.run(['sips', '-Z', '1200', 'public/logo-white.png'], check=True)
print("Saved public/logo.png and public/logo-white.png")

# 2. Hexagon Mark (logo-mark.png and logo-mark-white.png)
# Hexagon bbox in img_hex: x=(567, 1913), y=(982, 2525) -> w=1347, h=1544
# Make a square canvas with padding
hex_w = 1913 - 567 + 1
hex_h = 2525 - 982 + 1
dim = max(hex_w, hex_h) + 160
mark_canvas = bytearray(dim * dim * 4)
offset_x = (dim - hex_w) // 2
offset_y = (dim - hex_h) // 2

for y in range(982, 2526):
    dst_y = (y - 982) + offset_y
    for x in range(567, 1914):
        dst_x = (x - 567) + offset_x
        src_idx = (y * w_hex + x) * 4
        dst_idx = (dst_y * dim + dst_x) * 4
        mark_canvas[dst_idx : dst_idx + 4] = img_hex[src_idx : src_idx + 4]

write_png('public/logo-mark.png', dim, dim, mark_canvas)
subprocess.run(['sips', '-z', '512', '512', 'public/logo-mark.png'], check=True)

# Inverted logo-mark-white (black becomes white, white P/H becomes transparent or dark ink #2B1D16)
# For footer/dark use, white hexagon with dark cutouts:
mark_white = bytearray(len(mark_canvas))
for i in range(0, len(mark_canvas), 4):
    r, g, b, a = mark_canvas[i:i+4]
    if a > 20:
        # if pixel is dark (part of hexagon background), turn to white
        if r < 100:
            mark_white[i] = 255
            mark_white[i+1] = 255
            mark_white[i+2] = 255
            mark_white[i+3] = a
        else: # white P and H -> transparent
            mark_white[i] = 0
            mark_white[i+1] = 0
            mark_white[i+2] = 0
            mark_white[i+3] = 0

write_png('public/logo-mark-white.png', dim, dim, mark_white)
subprocess.run(['sips', '-z', '512', '512', 'public/logo-mark-white.png'], check=True)
print("Saved public/logo-mark.png and public/logo-mark-white.png")

# 3. Horizontal Lockup (logo-horizontal.png and logo-horizontal-white.png)
# Canvas: 930 x 300
# Target: Hexagon mark on left, text "PRINTHUB AFRICA" on right
# Hexagon source from img_hex: w=1347, h=1544
# Combined text source from img_full: x=(418, 2147), y=(2111, 2503) -> w=1730, h=393
# Let's save intermediate high-res mark and text, then scale down and compose
write_png('/tmp/raw_hex.png', hex_w, hex_h, crop_rgba(img_hex, w_hex, h_hex, 567, 982, 1913, 2525)[2])
text_w = 2147 - 418 + 1
text_h = 2503 - 2111 + 1
write_png('/tmp/raw_text.png', text_w, text_h, crop_rgba(img_full, w_full, h_full, 418, 2111, 2147, 2503)[2])

# Scale /tmp/raw_hex.png to height 230 px
# Hex aspect ratio: 1347 / 1544 = 0.872 -> at height 230, width = 201
subprocess.run(['sips', '--resampleHeight', '230', '/tmp/raw_hex.png'], check=True)
# Scale /tmp/raw_text.png to height 170 px
# Text aspect ratio: 1730 / 393 = 4.402 -> at height 170, width = 748
# Let's check text width: if width is around 630 px, height is around 143 px
subprocess.run(['sips', '--resampleWidth', '630', '/tmp/raw_text.png'], check=True)

# Read back scaled hex and text
w_h_scaled, h_h_scaled, img_h_scaled = parse_png('/tmp/raw_hex.png')
w_t_scaled, h_t_scaled, img_t_scaled = parse_png('/tmp/raw_text.png')

canvas_w = 930
canvas_h = 300
horiz_canvas = bytearray(canvas_w * canvas_h * 4)

# Place hex at x = 30, y centered: (canvas_h - h_h_scaled) // 2
hex_start_x = 30
hex_start_y = (canvas_h - h_h_scaled) // 2

for y in range(h_h_scaled):
    dst_y = hex_start_y + y
    if dst_y >= canvas_h: break
    for x in range(w_h_scaled):
        dst_x = hex_start_x + x
        if dst_x >= canvas_w: break
        s_idx = (y * w_h_scaled + x) * 4
        d_idx = (dst_y * canvas_w + dst_x) * 4
        horiz_canvas[d_idx:d_idx+4] = img_h_scaled[s_idx:s_idx+4]

# Place text at x = hex_start_x + w_h_scaled + 35, y centered: (canvas_h - h_t_scaled) // 2
text_start_x = hex_start_x + w_h_scaled + 35
text_start_y = (canvas_h - h_t_scaled) // 2

for y in range(h_t_scaled):
    dst_y = text_start_y + y
    if dst_y >= canvas_h: break
    for x in range(w_t_scaled):
        dst_x = text_start_x + x
        if dst_x >= canvas_w: break
        s_idx = (y * w_t_scaled + x) * 4
        d_idx = (dst_y * canvas_w + dst_x) * 4
        # simple alpha blend
        sa = img_t_scaled[s_idx + 3]
        if sa > 0:
            horiz_canvas[d_idx:d_idx+4] = img_t_scaled[s_idx:s_idx+4]

write_png('public/logo-horizontal.png', canvas_w, canvas_h, horiz_canvas)

# White horizontal logo for footer
horiz_white = bytearray(len(horiz_canvas))
for i in range(0, len(horiz_canvas), 4):
    r, g, b, a = horiz_canvas[i:i+4]
    if a > 20:
        if r < 100: # black parts -> white
            horiz_white[i] = 255
            horiz_white[i+1] = 255
            horiz_white[i+2] = 255
            horiz_white[i+3] = a
        else: # white interior -> transparent on dark
            horiz_white[i:i+4] = (0, 0, 0, 0)

write_png('public/logo-horizontal-white.png', canvas_w, canvas_h, horiz_white)
print("Saved public/logo-horizontal.png and public/logo-horizontal-white.png")
