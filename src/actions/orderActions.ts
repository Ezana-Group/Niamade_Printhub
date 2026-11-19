import type { DocumentActionComponent } from 'sanity'

export const PrintShippingLabelAction: DocumentActionComponent = (props) => {
  if (props.type !== 'order') return null;
  const doc: any = props.draft || props.published;
  if (!doc) return null;

  const orderRef = doc.orderRef || props.id;
  const query = new URLSearchParams({
    id: props.id,
    ref: orderRef,
    name: doc.customerName || '',
    phone: doc.customerPhone || '',
    city: doc.deliveryCity || '',
    address: doc.delivery || '',
    product: doc.productName || '',
    qty: String(doc.quantity || 1),
  });

  return {
    label: 'Print Shipping Label',
    icon: () => '🏷️',
    title: 'Open 4x6 / Box Shipping Label to print or save as PDF',
    onHandle: () => {
      window.open(`/print/shipping-label/?${query.toString()}`, '_blank');
    },
  };
};

export const PrintReceiptAction: DocumentActionComponent = (props) => {
  if (props.type !== 'order') return null;
  const doc: any = props.draft || props.published;
  if (!doc) return null;

  const orderRef = doc.orderRef || props.id;
  const query = new URLSearchParams({
    id: props.id,
    ref: orderRef,
    name: doc.customerName || '',
    phone: doc.customerPhone || '',
    email: doc.customerEmail || '',
    delivery: doc.delivery || '',
    product: doc.productName || '',
    amount: String(doc.amountKes || 0),
    paystackRef: doc.paystackRef || '',
  });

  return {
    label: 'Print Customer Receipt',
    icon: () => '🧾',
    title: 'Open official invoice / receipt to print or save as PDF',
    onHandle: () => {
      window.open(`/print/receipt/?${query.toString()}`, '_blank');
    },
  };
};

