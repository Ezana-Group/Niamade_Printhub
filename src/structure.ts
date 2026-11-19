import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('PrintHub Africa')
    .items([
      // ─── 🛍️ SHOP ORDERS & FULFILMENT ──────────────────────────────
      S.listItem()
        .title('Shop Orders & Fulfilment')
        .icon(() => '🛍️')
        .child(
          S.list()
            .title('Customer Orders')
            .items([
              S.listItem()
                .title('All Orders')
                .icon(() => '📋')
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('All Customer Orders')
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                      { field: '_createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title('✅ Paid — In Print Queue')
                .icon(() => '🖨️')
                .child(
                  S.documentList()
                    .title('Paid Orders (Queue)')
                    .schemaType('order')
                    .filter('_type == "order" && paymentStatus == "paid" && (fulfilmentStatus == "queued" || fulfilmentStatus == "printing")')
                    .defaultOrdering([{ field: 'paidAt', direction: 'asc' }])
                ),

              S.listItem()
                .title('🚚 Dispatched / Ready for Pickup')
                .icon(() => '📦')
                .child(
                  S.documentList()
                    .title('Dispatched / Ready Orders')
                    .schemaType('order')
                    .filter('_type == "order" && (fulfilmentStatus == "ready" || fulfilmentStatus == "dispatched")')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),

              S.listItem()
                .title('⏳ Pending Payment')
                .icon(() => '⏳')
                .child(
                  S.documentList()
                    .title('Pending Orders')
                    .schemaType('order')
                    .filter('_type == "order" && paymentStatus == "pending"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),

              S.listItem()
                .title('✔️ Completed / Delivered')
                .icon(() => '✔️')
                .child(
                  S.documentList()
                    .title('Delivered Orders')
                    .schemaType('order')
                    .filter('_type == "order" && fulfilmentStatus == "delivered"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ─── 📅 CUSTOMER BOOKINGS & APPOINTMENTS ───────────────────────
      S.listItem()
        .title('Customer Bookings & Appointments')
        .icon(() => '📅')
        .child(
          S.list()
            .title('Customer Bookings')
            .items([
              S.listItem()
                .title('All Bookings')
                .icon(() => '📋')
                .schemaType('booking')
                .child(
                  S.documentTypeList('booking')
                    .title('All Customer Bookings')
                    .defaultOrdering([
                      { field: 'appointmentDate', direction: 'desc' },
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title('Pending Confirmation')
                .child(
                  S.documentList()
                    .title('Pending Confirmation')
                    .schemaType('booking')
                    .filter('_type == "booking" && status == "pending"')
                    .defaultOrdering([{ field: 'appointmentDate', direction: 'asc' }])
                ),

              S.listItem()
                .title('Confirmed & Scheduled')
                .child(
                  S.documentList()
                    .title('Confirmed Bookings')
                    .schemaType('booking')
                    .filter('_type == "booking" && status == "confirmed"')
                    .defaultOrdering([{ field: 'appointmentDate', direction: 'asc' }])
                ),

              S.listItem()
                .title('Completed Consultations')
                .child(
                  S.documentList()
                    .title('Completed Consultations')
                    .schemaType('booking')
                    .filter('_type == "booking" && status == "completed"')
                    .defaultOrdering([{ field: 'appointmentDate', direction: 'desc' }])
                ),

              S.listItem()
                .title('Cancelled')
                .child(
                  S.documentList()
                    .title('Cancelled Bookings')
                    .schemaType('booking')
                    .filter('_type == "booking" && status == "cancelled"')
                    .defaultOrdering([{ field: 'appointmentDate', direction: 'desc' }])
                ),
            ])
        ),

      // ─── 💬 CONTACT & QUOTE REQUESTS ──────────────────────────────
      S.listItem()
        .title('Contact & Quote Inquiries')
        .icon(() => '💬')
        .child(
          S.documentTypeList('contactInquiry')
            .title('Contact & Quote Inquiries')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.divider(),

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
