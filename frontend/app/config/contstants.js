export const CURRENCIES = [{id:'WON',name:'WON', label:'₩'},{id:'USD',name:'USD', label:'$'}]
export const POSITIONS = [{id:'MEMBER',name:'MEMBER'},{id:'MANAGER',name:'MANAGER'}]
export const DEPARTMENTS=[
  {id:'PURCHASE',name:'PURCHASE'},
  {id:'SALE',name:'SALE'},
  {id:'ADMIN',name:'ADMIN'},
  {id:'PRODUCT',name:'PRODUCT'},
  {id:'HUMAN_RESOURCES',name:'HUMAN_RESOURCES'},
  {id:'GENERAL_AFFAIRS',name:'GENERAL_AFFAIRS'},
  {id:'RESEARCH&DEVELOPMENT',name:'RESEARCH&DEVELOPMENT'},
  {id:'IT',name:'IT'},]
export const DEFAULT_PAGINATION={
  page_size: 6,
  current:1
}

export const PRODUCT_FIELD_NAMES=[
  'barcode', 'qrcode', 'product_code', 
  'category_id','brand','name', 'description', 
  'total_quantity',
  'purchase_price', 'purchase_currency', 'sale_price', 'sale_currency', 
  'new', 'enabled', 'editable',
  'author', 
  'created_at', 'updated_at', 'deleted_at',
]


export const CATEGORY_FIELD_NAMES=[
  'name', 'description', 
  'new', 'enabled', 'editable',  
  'author', 
  'created_at', 'updated_at', 'deleted_at',
]

export const SUPPLIER_FIELD_NAMES=[
  'name', 'address',
  'mobile_phone', 'home_phone','home_phone', 'office_phone','other_phone', 
  'author', 
  'new', 'enabled', 'editable',
  'created_at', 'updated_at', 'deleted_at',
]

export const PURCHASE_FIELD_NAMES=[
  'order_number',   'author',   'supplier_id', 
  'enabled',   'new', 'editable',
  'comment', 
  'total_amount',   'subtotal_amount',   'currency', 
  'created_at',   'updated_at',   'deleted_at'
]

export const PURCHASE_ITEM_FIELD_NAMES=[
  'purchase_id',  'product_id', 'author',   'supplier_id', 
  'price', 'quantity', 'currency', 'currency_rate', 'total',
  'enabled',   'new', 'editable',
  'created_at',   'updated_at',   'deleted_at'
]

export const CUSTOMER_FIELD_NAMES=[
  'name', 'address',
  'mobile_phone', 'home_phone','home_phone', 'office_phone','other_phone', 
  'author', 
  'new', 'enabled', 'editable',
  'created_at', 'updated_at', 'deleted_at',
]

export const SALE_FIELD_NAMES=[
  'order_number',   'author',   'customer_id', 
  'enabled',   'new', 'editable',
  'comment', 
  'total_amount',   'subtotal_amount',   'currency', 
  'created_at',   'updated_at',   'deleted_at'
]

export const SALE_ITEM_FIELD_NAMES=[
  'sale_id',  'product_id', 'author',   'supplier_id', 
  'price', 'quantity', 'currency', 'currency_rate', 'total',
  'enabled',   'new', 'editable',
  'created_at',   'updated_at',   'deleted_at'
]

export const EMPLOYEE_FIELD_NAMES=[
  'id', 'department_id', 'full_name', 'first_name', 'last_name','position', 'birth_date',
  'username', 'password', 
  'email', 'phone', 'address', 
  'new', 'enabled', 'editable',
  'created_at', 'updated_at', 'deleted_at',
]

export const DEPARTMENT_FIELD_NAMES=[
  'name', 'role', 'leader', 
  'email', 'fax', 'phone', 'address',
  'new', 'enabled', 'editable',
  'author',
  'created_at', 'updated_at', 'deleted_at',
]