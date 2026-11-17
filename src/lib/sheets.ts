/**
 * Google Sheets Backup Loader for PrintHub Africa
 * Zero external dependencies — uses native fetch to parse any shared Google Sheet CSV.
 */

export interface SheetProduct {
  slug: string;
  name: string;
  cat: string;
  price: string;
  note: string;
  material: string;
  finish: string;
  tags: string[];
  blurb: string;
  uses: string[];
  care: string;
  photos?: string[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchProductsFromGoogleSheets(): Promise<SheetProduct[] | null> {
  const urlOrId = process.env.GOOGLE_SHEET_ID || import.meta.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_CSV_URL;
  if (!urlOrId) return null;

  let csvUrl = urlOrId;
  if (!urlOrId.startsWith("http")) {
    csvUrl = `https://docs.google.com/spreadsheets/d/${urlOrId}/export?format=csv`;
  }

  try {
    const res = await fetch(csvUrl);
    if (!res.ok) return null;

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) return null;

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    const products: SheetProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const item: any = {};
      headers.forEach((h, idx) => {
        item[h] = row[idx] || '';
      });

      const name = item.name || '';
      if (!name) continue;

      const slug = item.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      const cat = item.category || 'Home & decor';
      const price = item.price || 'KES 0';
      const tags = (item.occasions || item.tags || '').split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
      const uses = (item.uses || '').split(',').map((u: string) => u.trim()).filter(Boolean);
      const photos = item.photos ? item.photos.split(',').map((p: string) => p.trim()).filter(Boolean) : undefined;

      products.push({
        slug,
        name,
        cat,
        price,
        note: item.note || '',
        material: item.material || 'PLA',
        finish: item.finish || 'Smooth',
        tags,
        blurb: item.description || item.blurb || '',
        uses,
        care: item.care || '',
        photos,
      });
    }

    return products.length ? products : null;
  } catch (err) {
    console.error("[Google Sheets Error]", err);
    return null;
  }
}
