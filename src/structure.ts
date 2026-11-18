import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('PrintHub Africa')
    .items([
      // ─── 🛍️ SHOP & CATALOG ─────────────────────────────────────
      S.listItem()
        .title('Shop & Catalog')
        .icon(() => '🛍️')
        .child(
          S.list()
            .title('Shop & Catalog')
            .items([
              S.listItem()
                .title('All Products')
                .icon(() => '📦')
                .schemaType('product')
                .child(
                  S.documentTypeList('product')
                    .title('All Products')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                ),

              S.listItem()
                .title('On Sale / Promotional Pieces')
                .icon(() => '🔥')
                .child(
                  S.documentList()
                    .title('On Sale Products')
                    .schemaType('product')
                    .filter('_type == "product" && (onSale == true || defined(originalPrice))')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                ),

              S.listItem()
                .title('Client & Creator Collabs')
                .icon(() => '🤝')
                .child(
                  S.documentList()
                    .title('Creator Collaborations')
                    .schemaType('product')
                    .filter('_type == "product" && isCollab == true')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                ),

              S.divider(),

              S.listItem()
                .title('Product Categories')
                .icon(() => '📁')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Product Categories')),

              S.listItem()
                .title('Materials (PLA, PETG, TPU, PVA)')
                .icon(() => '🧪')
                .schemaType('material')
                .child(S.documentTypeList('material').title('3D Printing Materials')),

              S.listItem()
                .title('Occasions & Collections')
                .icon(() => '🏷️')
                .schemaType('occasion')
                .child(S.documentTypeList('occasion').title('Occasions & Gift Collections')),
            ])
        ),

      // ─── 🌐 WEBSITE & EDITORIAL ────────────────────────────────
      S.listItem()
        .title('Website & Editorial')
        .icon(() => '🌐')
        .child(
          S.list()
            .title('Website & Editorial')
            .items([
              S.listItem()
                .title('Help & FAQs')
                .icon(() => '❓')
                .schemaType('faq')
                .child(
                  S.documentTypeList('faq')
                    .title('Help & FAQs')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),

              S.listItem()
                .title('Services (B2B, Prototypes, Design)')
                .icon(() => '🛠️')
                .schemaType('service')
                .child(S.documentTypeList('service').title('Services')),

              S.listItem()
                .title('Page Headings & Copy')
                .icon(() => '📝')
                .schemaType('pageContent')
                .child(S.documentTypeList('pageContent').title('Page Content')),

              S.listItem()
                .title('Legal Pages (Terms, Privacy)')
                .icon(() => '⚖️')
                .schemaType('legalPage')
                .child(S.documentTypeList('legalPage').title('Legal Pages')),
            ])
        ),

      S.divider(),

      // ─── ⚙️ BUSINESS & SITE SETTINGS (Singleton) ───────────────
      S.listItem()
        .title('Business & Site Settings')
        .icon(() => '⚙️')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Business & Site Settings')
        ),
    ])
