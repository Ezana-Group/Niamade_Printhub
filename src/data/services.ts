// PrintHub Africa — Comprehensive Services Registry
// Drives both the /services/ overview hub and individual /services/[slug]/ SEO landing pages.

export interface ServiceItem {
  slug: string;
  title: string;
  shortTitle: string;
  badge: string;
  seoTitle: string;
  metaDescription: string;
  targetKeywords: string[];
  heroBlurb: string;
  turnaround: string;
  startingPrice: string;
  icon: string;
  benefits: { title: string; text: string }[];
  capabilities: { name: string; detail: string }[];
  processSteps: { step: string; title: string; desc: string }[];
  applications: string[];
  materialsRecommended: string[];
  faqs: { q: string; a: string }[];
}

export const services: ServiceItem[] = [
  {
    slug: "custom-3d-printing",
    title: "Custom 3D Printing on Demand",
    shortTitle: "Custom 3D Printing",
    badge: "Core Service",
    seoTitle: "Custom 3D Printing Service in Kenya | Fast STL & CAD Printing",
    metaDescription: "Professional custom 3D printing in Kenya. Send your STL/CAD file for precision printing in PLA, PETG, TPU, or ABS. Fast turnaround, M-Pesa accepted, nationwide delivery.",
    targetKeywords: ["custom 3d printing kenya", "3d printing service nairobi", "3d printing eldoret", "print stl file kenya", "on demand 3d printing"],
    heroBlurb: "Have a 3D model ready? We print it with industrial precision in engineering-grade materials, carefully sliced and quality-checked before nationwide dispatch.",
    turnaround: "24 – 48 Hours",
    startingPrice: "From KES 500",
    icon: "layers",
    benefits: [
      { title: "No Minimum Order", text: "Whether you need a single miniature bracket or 50 pieces, every order receives the same engineering inspection." },
      { title: "High-Speed Slicing & Printing", text: "Powered by modern high-speed CoreXY printers running at up to 500 mm/s for rapid turnaround." },
      { title: "Material Expertise", text: "We guide you to the right polymer: rigid PLA+, impact-resistant PETG, flexible TPU, or heat-resistant ABS." },
      { title: "Pre-Print File Verification", text: "Every model is analyzed for manifold geometry, thin walls, and weak layer orientations before printing." }
    ],
    capabilities: [
      { name: "Build Volume", detail: "Single pieces up to 256 × 256 × 256 mm (larger assemblies split & bonded seamlessly)" },
      { name: "Layer Resolutions", detail: "0.08 mm (ultra-fine detail) to 0.28 mm (rapid structural utility)" },
      { name: "Supported Formats", detail: ".STL, .3MF, .STEP, .OBJ, .IGES" },
      { name: "Tolerances", detail: "± 0.2 mm dimensional accuracy on calibrated machines" }
    ],
    processSteps: [
      { step: "1", title: "Submit Your 3D File", desc: "Send your STL or STEP file via WhatsApp, email, or our custom upload portal for an instant review." },
      { step: "2", title: "Review Material & Quote", desc: "We recommend optimal infill and orientation, then calculate exact print time, weight, and price." },
      { step: "3", title: "Print, Inspect & Deliver", desc: "Your piece is printed, deburred, dimensionally verified, and delivered anywhere in Kenya via trusted couriers." }
    ],
    applications: [
      "Custom electronics enclosures and Raspberry Pi cases",
      "Functional workshop jigs, mounts, and tool holders",
      "Bespoke replacement clips and interior automotive trims",
      "Cosplay accessories, figurines, and personalized gifts"
    ],
    materialsRecommended: ["PLA+", "PETG", "TPU (Flexible)", "ABS / ASA", "Matte Aesthetic PLA"],
    faqs: [
      {
        q: "What file format do I need to send for 3D printing?",
        a: "We accept .STL, .3MF, .STEP, and .OBJ files. If you designed in Fusion 360, SolidWorks, or Blender, exporting to .STEP or .3MF gives the highest dimensional accuracy."
      },
      {
        q: "How much does a custom 3D print cost?",
        a: "Pricing is calculated based on machine time, material weight in grams, and material type. Small utility clips start from KES 500, while larger enclosures typically range between KES 1,200 and KES 3,500."
      },
      {
        q: "How fast can I receive my print?",
        a: "Most single prints are completed within 24 to 48 hours. Orders within Eldoret can be picked up immediately upon completion; nationwide delivery (Nairobi, Mombasa, Kisumu, Nakuru) takes 1–2 business days via courier."
      },
      {
        q: "Can you print functional parts that withstand heat and mechanical stress?",
        a: "Yes. For parts exposed to sunlight, automotive heat, or physical load, we print in PETG (temperature resistant up to 75°C) or ABS/ASA (up to 95°C) with dense gyroid infill."
      }
    ]
  },
  {
    slug: "rapid-prototyping",
    title: "Rapid Prototyping & Product Development",
    shortTitle: "Rapid Prototyping",
    badge: "Engineering",
    seoTitle: "Rapid Prototyping Services Kenya | Functional 3D Product Testing",
    metaDescription: "Accelerate your hardware engineering with rapid 3D prototyping in Kenya. Iterate concepts in 24–48 hours, validate form and fit, and de-risk injection molds.",
    targetKeywords: ["rapid prototyping services kenya", "functional prototype 3d printing", "hardware product development nairobi", "prototype testing east africa"],
    heroBlurb: "Bridge the gap between digital CAD drawings and real-world physical testing. Hold your design in your hands, test tolerances, refine ergonomics, and iterate quickly.",
    turnaround: "24 – 72 Hours",
    startingPrice: "From KES 1,500",
    icon: "cpu",
    benefits: [
      { title: "Iterate Within 24 Hours", text: "Receive iterative revisions in hours rather than waiting weeks for overseas sample shipments." },
      { title: "De-Risk Tooling Investments", text: "Catch mechanical interferences and ergonomic flaws before committing thousands of dollars to steel molds." },
      { title: "Functional Assembly Fits", text: "We test threading, snap-fits, screw bosses, heat-set brass inserts, and O-ring seals directly on prototypes." },
      { title: "Confidentiality & IP Protection", text: "Your proprietary inventions, patent drawings, and CAD designs are guarded under strict non-disclosure." }
    ],
    capabilities: [
      { name: "Iterative Turnaround", detail: "Next-day prototype iterations for active engineering sprints" },
      { name: "Hardware Integration", detail: "Supports brass heat-set threaded inserts (M2–M8), captive nuts, and bearing presses" },
      { name: "Multi-Material Assemblies", detail: "Combine rigid frames with flexible elastomeric overmolds/gaskets in a single assembly" },
      { name: "Testing Support", detail: "Drop-test, bend, and thermal fit evaluations" }
    ],
    processSteps: [
      { step: "1", title: "CAD Review & Design for AM (DfAM)", desc: "We evaluate your CAD assembly for structural layer orientation, overhangs, and snap-fit tolerances." },
      { step: "2", title: "Rapid Iteration Print", desc: "First-article prototype produced within 24 hours with dimensional tolerance verification." },
      { step: "3", title: "Physical Testing & Optimization", desc: "Assemble real hardware, identify necessary geometric adjustments, and re-print improved versions instantly." }
    ],
    applications: [
      "IoT sensor enclosures and environmental telemetry nodes",
      "Medical device prototypes and ergonomic diagnostic handhelds",
      "Automotive sensor brackets and test-bench adapters",
      "Consumer consumer tech shells, remotes, and wearable mockups"
    ],
    materialsRecommended: ["PETG (Tough & Impact Resistant)", "Carbon-Fiber Reinforced PLA", "Engineering TPU 95A", "ABS"],
    faqs: [
      {
        q: "Why use 3D printing for prototyping instead of machining or molding?",
        a: "Injection molding requires KES 300,000+ in tooling and 4–8 weeks of lead time. 3D printing allows you to test functional prototypes in 24 hours for under KES 2,000, letting you fix mistakes before spending on production."
      },
      {
        q: "Can 3D printed prototypes include metal hardware and threads?",
        a: "Yes. We frequently install ultrasonic heat-set brass threaded inserts (M2 through M8), captive stainless steel hex nuts, and press-fit bearings into prototypes for real mechanical testing."
      },
      {
        q: "Do you sign Non-Disclosure Agreements (NDAs)?",
        a: "Yes, we routinely execute bilateral NDAs for startups, research institutions, and established engineering firms prior to file submission."
      },
      {
        q: "Can you help refine the CAD design if something doesn't fit?",
        a: "Yes, our in-house mechanical design team can modify wall thicknesses, adjust snap-fits, and add structural ribs to ensure mechanical reliability."
      }
    ]
  },
  {
    slug: "batch-production",
    title: "Low-Volume Batch Production & Small Runs",
    shortTitle: "Batch Production",
    badge: "Manufacturing",
    seoTitle: "Low-Volume 3D Print Batch Manufacturing in Kenya | 10 to 500+ Units",
    metaDescription: "Cost-effective small-batch manufacturing without tooling costs in Kenya. Produce 10 to 500+ plastic parts with volume discounts and fast lead times.",
    targetKeywords: ["batch 3d printing kenya", "low volume manufacturing nairobi", "short run plastic parts", "custom merchandise 3d print"],
    heroBlurb: "The economical sweet spot between single prototypes and mass injection molding. Produce 10 to 500+ production-grade units with volume discounts and zero tooling expenses.",
    turnaround: "3 – 7 Business Days",
    startingPrice: "Tiered Volume Discounts (15% – 40% Off)",
    icon: "boxes",
    benefits: [
      { title: "Zero Tooling or Mold Costs", text: "Start selling or deploying products on Day 1 without spending hundreds of thousands on injection tooling." },
      { title: "Volume-Based Progressive Pricing", text: "Unit costs drop automatically as batch sizes increase (10–25 pcs: -15%, 26–100 pcs: -25%, 100+ pcs: -40%)." },
      { title: "On-the-Fly Design Revisions", text: "Need to update a mounting hole or add a logo on batch #2? Update the digital file without scrapping metal molds." },
      { title: "Distributed Farm Capacity", text: "Our multi-machine production fleet runs synchronized parallel print jobs 24/7 to deliver tight commercial deadlines." }
    ],
    capabilities: [
      { name: "Batch Capacities", detail: "10 to 500+ finished units per production run" },
      { name: "Consistent Quality", detail: "Digitally matched print profiles and calibrated nozzle arrays ensure part-to-part repeatability" },
      { name: "Post-Processing Options", detail: "Support removal, surface smoothing, brass insert installation, and bulk retail packaging" },
      { name: "Quality Assurance", detail: "Random batch sample caliper verification and destructive load testing upon request" }
    ],
    processSteps: [
      { step: "1", title: "Sample Approval & Bed Layout", desc: "We slice a single first-article proof and optimize plate nesting for maximum print density and speed." },
      { step: "2", title: "Farm Print Execution", desc: "Synchronized print jobs dispatched across our calibrated printer fleet under monitored LAN telemetry." },
      { step: "3", title: "Batch QA, Packing & Dispatch", desc: "Every unit is inspected, deburred, count-verified, and packed in protective batch crates for delivery." }
    ],
    applications: [
      "Custom branded corporate gifts, keychains, and event swag",
      "Specialty agricultural sensor clips and irrigation line holders",
      "Retail display fixtures, branded signage, and merchandise stands",
      "Specialized drone replacement parts and robotics fleet components"
    ],
    materialsRecommended: ["PETG (Durable & Weatherproof)", "Matte PLA (Aesthetic Clean Finish)", "TPU 95A (Impact Absorbing)"],
    faqs: [
      {
        q: "How many parts can PrintHub produce in a batch run?",
        a: "Our typical small-run batches range from 10 to 500 units. For runs of 50 to 100 parts, delivery usually completes within 3 to 5 business days."
      },
      {
        q: "How much cheaper is batch production compared to a single unit?",
        a: "Batch orders receive substantial volume discounts: 10–25 units receive ~15% off, 26–100 units receive ~25% off, and orders over 100 units receive up to 40% off single-part pricing."
      },
      {
        q: "Can each item in the batch have unique text or serial numbers?",
        a: "Yes! Because 3D printing is digital fabrication, we can dynamically serialize parts, imprint custom names, or change QR codes across individual units without extra tooling fees."
      },
      {
        q: "What payment terms do you offer for batch manufacturing?",
        a: "Batch orders require a 50% commitment deposit via M-Pesa or Bank Transfer upon sample approval, with the remaining 50% payable upon delivery inspection."
      }
    ]
  },
  {
    slug: "replacement-parts",
    title: "Broken Part Replacement & Reverse Engineering",
    shortTitle: "Replacement Parts",
    badge: "Repair & Sustainability",
    seoTitle: "Replace Broken Plastic Parts in Kenya | 3D Reverse Engineering & Repair",
    metaDescription: "Don't discard appliances or machinery due to broken plastic pieces. Send your broken clip, gear, or handle to PrintHub Africa for 3D measurement, redesign, and reproduction.",
    targetKeywords: ["replace broken plastic parts kenya", "3d print replacement gear nairobi", "reverse engineer broken plastic clip", "reproduce discontinued parts"],
    heroBlurb: "When appliances, vehicles, or industrial machines break an obsolete or expensive plastic clip, gear, or bracket, we recreate a durable, reinforced 3D replacement.",
    turnaround: "48 – 72 Hours",
    startingPrice: "From KES 800",
    icon: "wrench",
    benefits: [
      { title: "Save Expensive Equipment", text: "Avoid replacing entire machines or waiting months for overseas original spares over a KES 800 broken plastic clip." },
      { title: "Strengthened Redesign", text: "We don't just copy the original flaw — we add filleted corners, thicker wall sections, and stronger polymers so it won't break again." },
      { title: "Recreate Discontinued Parts", text: "Obsolete vintage cars, imported appliances, or out-of-warranty tools are easily revived without OEM parts." },
      { title: "Physical Sample or Digital Photo", text: "Bring or courier your broken pieces to our Eldoret workshop, or send calibrated caliper photos from anywhere in Kenya." }
    ],
    capabilities: [
      { name: "Precision Measurement", detail: "Digital vernier calipers, thread pitch gauges, and radius combs" },
      { name: "Reinforcement Engineering", detail: "Stress-concentration mitigation, gusset additions, and optimized layer adhesion planes" },
      { name: "Wear-Resistant Polymers", detail: "Self-lubricating PETG, tough ABS, and impact-resistant semi-rigid TPU" },
      { name: "Rapid Fit Test", detail: "Quick low-infill draft test prints to confirm snap-fit engagement before final structural print" }
    ],
    processSteps: [
      { step: "1", title: "Send Broken Pieces", desc: "Deliver or ship your broken sample to our workshop, or send clear photos with reference dimensions." },
      { step: "2", title: "Parametric CAD Recreation", desc: "Our engineers recreate the geometry in 3D CAD, correcting fractures and reinforcing stress points." },
      { step: "3", title: "Reinforced 3D Print", desc: "Printed in high-strength PETG or ABS with optimized fiber alignment, ready for drop-in installation." }
    ],
    applications: [
      "Automotive AC vent louvers, door handle clips, and sensor brackets",
      "Washing machine knobs, dishwasher wheels, and blender drive couplings",
      "Office chair lever handles, monitor arm clips, and caster housings",
      "Manufacturing conveyor guides, sensor mounts, and equipment covers"
    ],
    materialsRecommended: ["PETG (High Tensile & UV Resistant)", "ABS (High Impact & Heat)", "Engineering TPU 95A (Unbreakable Flexible Gaskets)"],
    faqs: [
      {
        q: "What if my broken part is shattered into multiple pieces?",
        a: "Bring all the fragments! Even if broken in half, we can align the pieces, take critical caliper measurements, and digitally reconstruct the pristine unbroken part in CAD."
      },
      {
        q: "Will the 3D printed replacement be as strong as the original molded plastic?",
        a: "In many cases, it is actually stronger! We deliberately reinforce the specific area that failed by thickening thin walls, adding reinforcing ribs, and using engineering PETG instead of brittle original polystyrene."
      },
      {
        q: "How do I get my broken part to you if I am in Nairobi, Mombasa, or Kisumu?",
        a: "You can courier your broken sample directly to our Eldoret workshop via EasyCoach, Wells Fargo, G4S, or Speedaf. Once received, we measure and print your replacement within 48 hours."
      },
      {
        q: "Can you recreate moving gears or threaded parts?",
        a: "Yes. We reproduce spur gears, helical gears, lead-screw nuts, and metric/imperial screw threads with calibrated clearance offsets so they mesh smoothly."
      }
    ]
  },
  {
    slug: "3d-cad-design",
    title: "3D CAD Modeling & Digital Design",
    shortTitle: "3D CAD Design",
    badge: "Design Services",
    seoTitle: "3D CAD Modeling & Product Design in Kenya | Idea to 3D Printable File",
    metaDescription: "Turn napkin sketches, photos, or rough concepts into production-ready 3D CAD models (.STEP, .STL). Professional mechanical and product design services in Kenya.",
    targetKeywords: ["3d cad design kenya", "3d modeling service nairobi", "freelance cad designer eldoret", "convert sketch to 3d model", "solidworks fusion 360 kenya"],
    heroBlurb: "Have an innovative idea, sketch, or physical mechanism but lack 3D modeling skills? Our mechanical designers convert your concepts into clean, parametric 3D CAD files ready for fabrication.",
    turnaround: "1 – 3 Business Days",
    startingPrice: "From KES 1,200",
    icon: "compass",
    benefits: [
      { title: "Parametric & Editable Files", text: "We deliver industry-standard .STEP and .STL files that you can modify, patent, or send to any fabrication facility worldwide." },
      { title: "Design for Additive Manufacturing (DfAM)", text: "Our designs are engineered specifically to avoid unnecessary support material, reduce print time, and maximize strength." },
      { title: "Interactive 3D Previews", text: "Review your model on your phone or computer in an interactive 3D viewer before giving print approval." },
      { title: "Engineering Documentation", text: "Technical dimensioned drawings (PDF) available for patent filings, manufacturing handoffs, and assembly manuals." }
    ],
    capabilities: [
      { name: "Software Suites", detail: "Autodesk Fusion 360, SolidWorks, FreeCAD, Blender, and Rhino" },
      { name: "Design Deliverables", detail: ".STEP (native parametric solid), .STL (3D printable mesh), .3MF, .DXF (laser cutting), and 2D technical drawings" },
      { name: "Mechanism Design", detail: "Hinges, gears, latches, snap-locks, and sliding tracks" },
      { name: "Surfacing & Ergonomics", detail: "Comfortable handheld curves and sculpted aesthetic enclosures" }
    ],
    processSteps: [
      { step: "1", title: "Initial Concept & Brief", desc: "Share your sketch, reference photos, dimensions, and functional requirements over WhatsApp or video call." },
      { step: "2", title: "Parametric 3D CAD Draft", desc: "Our engineers build the model and send you an interactive 3D web link to inspect and rotate on your screen." },
      { step: "3", title: "Revision & File Export", desc: "We implement your feedback, export high-precision files, and prepare them for seamless physical 3D printing." }
    ],
    applications: [
      "Custom enclosure design for custom PCBs and hardware electronics",
      "Ergonomic product handles, grips, and handheld tools",
      "Patent prototype drawings and functional investor pitch models",
      "Commercial display stands, personalized trophies, and artistic fixtures"
    ],
    materialsRecommended: ["Digital CAD Delivery (.STEP, .STL)", "PLA Proof of Concept", "PETG Functional Verification"],
    faqs: [
      {
        q: "What do I need to provide to start a CAD design project?",
        a: "A simple hand sketch with rough measurements, reference photos of similar objects, or a clear voice note explaining what you want the object to do is enough to get started."
      },
      {
        q: "Do I own the intellectual property (IP) and files?",
        a: "100% yes. Upon final payment, all copyright, 3D CAD source files (.STEP, .STL, .F3D), and manufacturing drawings belong exclusively to you."
      },
      {
        q: "Can I use your 3D files for injection molding or CNC machining later?",
        a: "Yes. We deliver standard .STEP files (ISO 10303) that are universally compatible with CNC machining, sheet metal fabrication, and injection mold toolmakers anywhere in the world."
      },
      {
        q: "How many revisions are included?",
        a: "Every CAD project includes up to 2 rounds of design revisions to fine-tune dimensions, aesthetic details, and tolerances based on your feedback."
      }
    ]
  },
  {
    slug: "architectural-scale-models",
    title: "Architectural 3D Scale Models & Topography",
    shortTitle: "Architectural Models",
    badge: "Architecture & GIS",
    seoTitle: "Architectural 3D Scale Model Printing in Kenya | Real Estate & Topo",
    metaDescription: "High-precision physical architectural scale models for architects, developers, and students in Kenya. Convert Revit, SketchUp, and GIS contours into tangible presentation models.",
    targetKeywords: ["architectural scale models kenya", "3d print architectural model nairobi", "physical scale models real estate", "topographic relief 3d print"],
    heroBlurb: "Bring blueprints and 3D renders to life with tangible, physical scale models. Impress property buyers, planning authorities, and design review boards with high-definition physical models.",
    turnaround: "4 – 10 Business Days",
    startingPrice: "Custom Quoted by Footprint & Scale",
    icon: "home",
    benefits: [
      { title: "Direct BIM / CAD Conversion", text: "We work directly with exports from Revit, SketchUp, ArchiCAD, Rhino, and AutoCAD." },
      { title: "Accurate Topographic Contours", text: "Import elevation data and GIS coordinates into multi-tiered topographical landscape models." },
      { title: "Modular & Removable Floorplates", text: "Showcase interior room layouts with stackable, magnetically aligned floor levels that lift off effortlessly." },
      { title: "Presentation-Ready Finish", text: "Clean architectural matte white finish, crisp window frames, and laser-accurate site context." }
    ],
    capabilities: [
      { name: "Common Scales", detail: "1:50, 1:100, 1:200, 1:500, and 1:1000 topographical models" },
      { name: "Site Dimensions", detail: "Modular multi-tile presentation tables up to 1.5 × 1.0 meters" },
      { name: "Detail Elements", detail: "Structural columns, balconies, stairs, window mullions, and roof trusses down to 0.4 mm resolution" },
      { name: "Display Bases", detail: "Optional acrylic vitrines, wooden baseboards, and brass engraved project plates" }
    ],
    processSteps: [
      { step: "1", title: "BIM / CAD Model Clean-up", desc: "We review your architectural file, solidify thin walls, and prepare hollow floor slabs for physical printing." },
      { step: "2", title: "Modular Tile Printing", desc: "Printed on high-precision CoreXY machines in architectural white matte polymer with clean layer definition." },
      { step: "3", title: "Assembly & Quality Finishing", desc: "Floors, site contours, and structural features are hand-assembled, inspected, and crated for safe transit." }
    ],
    applications: [
      "Commercial real estate sales galleries and residential masterplan displays",
      "County physical planning and environmental impact presentations",
      "Architecture student thesis presentations and final jury exhibitions",
      "Resort, hotel, and golf estate landscape topographic visualizations"
    ],
    materialsRecommended: ["Architectural White Matte PLA", "Woodfill PLA (Contour Terraces)", "Translucent PETG (Glazing Elements)"],
    faqs: [
      {
        q: "Can you print directly from a Revit or SketchUp file?",
        a: "Yes. We take your Revit, ArchiCAD, SketchUp, or Rhino 3D model, clean up non-manifold geometry, thicken scale-incompatible walls, and prepare it for printing."
      },
      {
        q: "Can the roof or upper floors be removed to show the interior layout?",
        a: "Yes! We specialize in modular floor plates that can be lifted off to reveal internal room divisions, staircases, and furniture layouts."
      },
      {
        q: "How do you ensure safe delivery of delicate architectural models?",
        a: "Models are packed in custom multi-layer foam-cushioned crates. For large masterplans in Nairobi, Eldoret, or Kisumu, we also offer accompanied direct delivery."
      },
      {
        q: "How far in advance should we order a model for an exhibition or jury?",
        a: "We recommend booking 1 to 2 weeks before your presentation date to allow sufficient time for file preparation, print execution, and detailing."
      }
    ]
  }
];

export function getService(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}
