import type { DocumentActionComponent } from 'sanity'

export const PrintShippingLabelAction: DocumentActionComponent = (props) => {
  if (props.type !== 'order') return null;
  const doc: any = props.published || props.draft;
  const orderRef = doc?.orderRef || props.id;

  return {
    label: 'Print Shipping Label',
    icon: () => '🏷️',
    title: 'Open 4x6 / Box Shipping Label to print or save as PDF',
    onHandle: () => {
      window.open(`/print/shipping-label/?ref=${encodeURIComponent(orderRef)}&id=${encodeURIComponent(props.id)}`, '_blank');
    },
  };
};

export const PrintReceiptAction: DocumentActionComponent = (props) => {
  if (props.type !== 'order') return null;
  const doc: any = props.published || props.draft;
  const orderRef = doc?.orderRef || props.id;

  return {
    label: 'Print Customer Receipt',
    icon: () => '🧾',
    title: 'Open official invoice / receipt to print or save as PDF',
    onHandle: () => {
      window.open(`/print/receipt/?ref=${encodeURIComponent(orderRef)}&id=${encodeURIComponent(props.id)}`, '_blank');
    },
  };
};
