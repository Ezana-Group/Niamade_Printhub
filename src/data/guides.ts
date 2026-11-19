/**
 * Practical 3D printing engineering guides for PrintHub Africa.
 * Written with general, verified engineering principles for makers, clients and answer engines.
 */

export interface Guide {
  slug: string;
  title: string;
  seoTitle: string;
  metaDesc: string;
  updatedAt: string; // ISO date string for lastmod and schema
  readTime: string;
  summary: string;
  content: {
    lead: string;
    sections: Array<{
      heading: string;
      bodyHtml: string;
    }>;
  };
  relatedSlugs: string[];
}

export const guides: Guide[] = [
  {
    slug: "pla-vs-petg-vs-tpu",
    title: "PLA vs PETG vs TPU: Choosing the Right 3D Printing Material in Kenya",
    seoTitle: "PLA vs PETG vs TPU: 3D Printing Materials Guide Kenya",
    metaDesc: "Compare PLA, PETG and TPU 3D printing filaments in Kenya: temperature resistance, outdoor UV stability, mechanical toughness, and best practical use cases.",
    updatedAt: "2026-03-15",
    readTime: "5 min read",
    summary: "A practical guide to selecting the right thermoplastic for your 3D print in Kenya, considering high sun exposure, vehicle interiors, and mechanical load.",
    content: {
      lead: "Selecting the correct filament is the difference between a part that lasts for years and one that warps on a warm afternoon. In equatorial Kenya, sunlight, daytime warmth, and ambient dust are real engineering constraints.",
      sections: [
        {
          heading: "1. PLA (Polylactic Acid): The Aesthetic & Prototyping Standard",
          bodyHtml: "<p>PLA is an eco-friendly bioplastic derived from fermented plant starch (corn or sugarcane). It is the most popular 3D printing material worldwide because of its exceptional dimensional precision, crisp detail reproduction, and broad palette of matte, silk, and dual-colour finishes.</p><p><strong>When to choose PLA:</strong> Interior decor, lithophanes, desk accessories, architectural models, classroom visualisations, and visual prototypes.</p><p><strong>Thermal limitation:</strong> PLA begins softening at around 55°C to 60°C (glass transition temperature). Do not leave PLA items on a car dashboard parked in direct Kenyan sunlight, or expose them to boiling water.</p>"
        },
        {
          heading: "2. PETG (Polyethylene Terephthalate Glycol): The Tough All-Rounder",
          bodyHtml: "<p>PETG blends the ease of printing with the rugged impact resistance and weather tolerance of engineering thermoplastics. It is chemically stable, water-impermeable, and resists temperatures up to approximately 75°C to 80°C.</p><p><strong>When to choose PETG:</strong> Functional brackets, drone parts, outdoor signage, automotive clips, enclosure housings, and replacement mechanical components that face repeated physical stress.</p><p><strong>Kenya weather tolerance:</strong> PETG handles UV exposure and high afternoon ambient temperatures significantly better than standard PLA without warping or embrittlement.</p>"
        },
        {
          heading: "3. TPU (Thermoplastic Polyurethane): Flexible & Shock-Absorbing",
          bodyHtml: "<p>TPU is an elastomeric polymer that behaves like vulcanised rubber. It bends, flexes, and absorbs heavy impacts without cracking or deforming permanently.</p><p><strong>When to choose TPU:</strong> Impact bumpers, phone and tablet rugged cases, vibration dampeners, gaskets, protective sleeves, flexible seals, and wearable components.</p><p><strong>Shore hardness:</strong> Most standard desktop TPU filament is rated around 95A Shore hardness, giving it the feel of a durable skate wheel or tough sneaker sole.</p>"
        },
        {
          heading: "Quick Material Comparison Matrix",
          bodyHtml: `<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse text-sm"><thead class="border-b-2 border-line"><tr><th class="py-2 pr-4 font-bold">Property</th><th class="py-2 pr-4 font-bold">PLA</th><th class="py-2 pr-4 font-bold">PETG</th><th class="py-2 font-bold">TPU</th></tr></thead><tbody class="divide-y divide-line/60"><tr><td class="py-2.5 pr-4 font-semibold">Heat Tolerance</td><td class="py-2.5 pr-4">~55°C (low)</td><td class="py-2.5 pr-4">~80°C (good)</td><td class="py-2.5">~80°C (good)</td></tr><tr><td class="py-2.5 pr-4 font-semibold">Impact Strength</td><td class="py-2.5 pr-4">Rigid / brittle</td><td class="py-2.5 pr-4">High toughness</td><td class="py-2.5">Extremely high</td></tr><tr><td class="py-2.5 pr-4 font-semibold">Outdoor / UV</td><td class="py-2.5 pr-4">Indoor only</td><td class="py-2.5 pr-4">Good for outdoor</td><td class="py-2.5">Excellent resistance</td></tr><tr><td class="py-2.5 pr-4 font-semibold">Surface Finish</td><td class="py-2.5 pr-4">Crisp, matte or silk</td><td class="py-2.5 pr-4">Slightly glossy</td><td class="py-2.5">Textured rubber-like</td></tr></tbody></table></div>`
        }
      ]
    },
    relatedSlugs: ["how-to-prepare-a-3d-file-for-printing", "how-to-measure-a-broken-part-for-a-replacement"]
  },
  {
    slug: "how-to-prepare-a-3d-file-for-printing",
    title: "How to Prepare a 3D CAD File for Printing: Formats, Slicing & Wall Thickness",
    seoTitle: "How to Prepare a 3D File for Printing (STEP, STL, 3MF)",
    metaDesc: "Learn how to prepare 3D CAD files for manufacturing: STEP vs STL vs 3MF, manifold geometry, recommended wall thickness, clearances and orientation.",
    updatedAt: "2026-03-18",
    readTime: "6 min read",
    summary: "Everything you need to know before sending a 3D design to the slicer: file formats, watertight geometry, minimum wall thicknesses, and hole clearances.",
    content: {
      lead: "A successful 3D print starts long before the nozzle heats up. Preparing clean CAD geometry ensures your part arrives dimensionally accurate, mechanically sound, and cost-efficient.",
      sections: [
        {
          heading: "1. File Formats: STEP vs 3MF vs STL",
          bodyHtml: "<p><strong>STEP (.step, .stp):</strong> The preferred standard for engineering and CAD models. STEP files preserve true parametric curves and NURBS surfaces rather than approximating curves with flat triangles. Modern slicers can slice directly from STEP with maximum fidelity.</p><p><strong>3MF (.3mf):</strong> The modern open XML-based 3D printing format. 3MF files store mesh data alongside unit definitions (mm), multi-colour assignments, and orientation without file bloat.</p><p><strong>STL (.stl):</strong> The legacy format. If exporting to STL, always export with 'Fine' or 'High' resolution to prevent visible faceting on curved cylinders, but avoid multi-hundred megabyte meshes that crash slicer software.</p>"
        },
        {
          heading: "2. Ensure Watertight (Manifold) Geometry",
          bodyHtml: "<p>A 3D model must be a solid, manifold volume. Common CAD export pitfalls include inverted surface normals, unstitched open surfaces, zero-thickness walls, and intersecting internal cavities. Slicers cannot determine which side is 'inside' versus 'outside' when surfaces have holes.</p>"
        },
        {
          heading: "3. Minimum Wall Thickness & Rib Design",
          bodyHtml: "<p>As a rough engineering guide for desktop FDM (Fused Deposition Modelling) with typical 0.4mm nozzles:</p><ul class=\"list-disc list-inside space-y-1.5 my-2\"><li><strong>Absolute minimum wall thickness:</strong> ~1.2mm (roughly 3 perimeter wall loops) for non-structural shells.</li><li><strong>Load-bearing structural walls:</strong> ~2.0mm to 3.0mm, reinforced with internal fillets or stiffening ribs rather than solid infill.</li><li><strong>Embossed or debossed lettering:</strong> At least 0.5mm depth and 0.8mm line stroke width to remain legible after printing.</li></ul>"
        },
        {
          heading: "4. Clearance & Interlocking Fit Tolerances",
          bodyHtml: "<p>Because molten thermoplastic expands slightly during extrusion and contracts as it cools, mating parts require intentional clearance:</p><ul class=\"list-disc list-inside space-y-1.5 my-2\"><li><strong>Press-fit / snap-fit:</strong> 0.15mm to 0.20mm total diametric offset.</li><li><strong>Sliding or rotating joints:</strong> 0.35mm to 0.50mm clearance between concentric surfaces.</li><li><strong>Threaded fasteners:</strong> Standard M3 to M8 internal threads print cleanly when modeled with an extra 0.2mm radial allowance or tapped with a metal hand tap after printing.</li></ul>"
        }
      ]
    },
    relatedSlugs: ["pla-vs-petg-vs-tpu", "how-to-measure-a-broken-part-for-a-replacement"]
  },
  {
    slug: "how-to-measure-a-broken-part-for-a-replacement",
    title: "How to Measure a Broken Plastic Part for 3D Replication",
    seoTitle: "How to Measure a Broken Part for 3D Printing Replication",
    metaDesc: "Step-by-step guide to measuring snapped or worn plastic components for reverse engineering and 3D printing: photos, calipers, reference scales and load direction.",
    updatedAt: "2026-03-20",
    readTime: "5 min read",
    summary: "How to capture precise dimensions, photos, and load directions when requesting a replacement for a broken appliance bracket, car clip, or gear.",
    content: {
      lead: "When an obscure plastic bracket snaps, manufacturer replacements are often unavailable or cost an exorbitant amount in shipping. 3D reverse-engineering can reproduce the part, often in a stronger material like PETG.",
      sections: [
        {
          heading: "1. Take Flat Orthogonal Photographs with a Reference Scale",
          bodyHtml: "<p>Place the broken pieces flat on a clean surface alongside a physical ruler, coin, or graph paper. Take clear, overhead photos perpendicular to the object (not at an artistic angle) to eliminate perspective distortion. Capture top, side, and front views.</p>"
        },
        {
          heading: "2. Key Dimensions to Capture (Prefer Vernier Calipers)",
          bodyHtml: "<p>While a ruler gives rough bounds, digital or manual vernier calipers provide the sub-millimetre precision required for functional parts:</p><ul class=\"list-disc list-inside space-y-1.5 my-2\"><li><strong>Mounting hole diameters & centre-to-centre spacing:</strong> Measure from hole centre to hole centre, or measure inner-edge to outer-edge of identical holes.</li><li><strong>Critical mating thicknesses:</strong> Measure where the bracket clamps or slides into the chassis.</li><li><strong>Overall bounding envelope:</strong> The maximum width, length, and height permissible in the installation space.</li></ul>"
        },
        {
          heading: "3. Identify the Failure Mode and Load Direction",
          bodyHtml: "<p>Understanding why the original component broke allows us to reinforce the reproduction:</p><ul class=\"list-disc list-inside space-y-1.5 my-2\"><li>Did it crack under continuous tension, sudden impact shock, or thermal fatigue?</li><li>Which axis takes the primary force? In 3D printing, parts are strongest along the XY print plane; orienting the layer lines perpendicular to the tension prevents delamination.</li><li>We frequently add structural fillet radiuses to sharp internal corners, which drastically reduces mechanical stress concentrations.</li></ul>"
        },
        {
          heading: "4. Keep the Broken Fragments",
          bodyHtml: "<p>Never discard the shattered pieces. Even fractured halves can be temporarily taped together or measured across the break to confirm original dimensions. If you are near Eldoret, you can also drop the original part off for physical measurement and test fitting.</p>"
        }
      ]
    },
    relatedSlugs: ["pla-vs-petg-vs-tpu", "how-to-prepare-a-3d-file-for-printing"]
  }
];
