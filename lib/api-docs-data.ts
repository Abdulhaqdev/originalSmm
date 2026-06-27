export const API_V2_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.orginal-smm.com/api"}/v2/`;

export type ApiDocSectionId =
  | "services"
  | "addOrder"
  | "orderStatus"
  | "multipleOrdersStatus"
  | "balance";

export interface ApiDocParameter {
  name: string;
  descriptionKey: string;
  optional?: boolean;
}

export interface ApiDocSection {
  id: ApiDocSectionId;
  titleKey: string;
  descriptionKey?: string;
  action: string;
  parameters: ApiDocParameter[];
  exampleResponse: string;
}

export const API_DOC_SECTIONS: ApiDocSection[] = [
  {
    id: "services",
    titleKey: "sections.services.title",
    descriptionKey: "sections.services.description",
    action: "services",
    parameters: [
      { name: "key", descriptionKey: "parameters.key" },
      { name: "action", descriptionKey: "parameters.actionServices" },
    ],
    exampleResponse: `[
  {
    "service": 1,
    "name": "Instagram Followers",
    "type": "Default",
    "category": "Instagram",
    "rate": "15000",
    "min": "100",
    "max": "10000",
    "refill": true,
    "cancel": true
  },
  {
    "service": 2,
    "name": "YouTube Views",
    "type": "Default",
    "category": "YouTube",
    "rate": "8000",
    "min": "500",
    "max": "50000",
    "refill": false,
    "cancel": true
  }
]`,
  },
  {
    id: "addOrder",
    titleKey: "sections.addOrder.title",
    descriptionKey: "sections.addOrder.description",
    action: "add",
    parameters: [
      { name: "key", descriptionKey: "parameters.key" },
      { name: "action", descriptionKey: "parameters.actionAdd" },
      { name: "service", descriptionKey: "parameters.service" },
      { name: "link", descriptionKey: "parameters.link" },
      { name: "quantity", descriptionKey: "parameters.quantity" },
      { name: "runs", descriptionKey: "parameters.runs", optional: true },
      { name: "interval", descriptionKey: "parameters.interval", optional: true },
    ],
    exampleResponse: `{
  "order": 23501
}`,
  },
  {
    id: "orderStatus",
    titleKey: "sections.orderStatus.title",
    descriptionKey: "sections.orderStatus.description",
    action: "status",
    parameters: [
      { name: "key", descriptionKey: "parameters.key" },
      { name: "action", descriptionKey: "parameters.actionStatus" },
      { name: "order", descriptionKey: "parameters.order" },
    ],
    exampleResponse: `{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "UZS"
}`,
  },
  {
    id: "multipleOrdersStatus",
    titleKey: "sections.multipleOrdersStatus.title",
    descriptionKey: "sections.multipleOrdersStatus.description",
    action: "status",
    parameters: [
      { name: "key", descriptionKey: "parameters.key" },
      { name: "action", descriptionKey: "parameters.actionStatus" },
      { name: "orders", descriptionKey: "parameters.orders" },
    ],
    exampleResponse: `{
  "1": {
    "charge": "0.27819",
    "start_count": "3572",
    "status": "Partial",
    "remains": "157",
    "currency": "UZS"
  },
  "10": {
    "error": "Incorrect order ID"
  },
  "100": {
    "charge": "1.44219",
    "start_count": "234",
    "status": "In progress",
    "remains": "10",
    "currency": "UZS"
  }
}`,
  },
  {
    id: "balance",
    titleKey: "sections.balance.title",
    descriptionKey: "sections.balance.description",
    action: "balance",
    parameters: [
      { name: "key", descriptionKey: "parameters.key" },
      { name: "action", descriptionKey: "parameters.actionBalance" },
    ],
    exampleResponse: `{
  "balance": "100842.00",
  "currency": "UZS"
}`,
  },
];

export const PHP_EXAMPLE = `<?php
$api_url = '${API_V2_URL}';
$api_key = 'YOUR_API_KEY';

$post = [
    'key'    => $api_key,
    'action' => 'services',
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>`;
