import { Container } from "react-bootstrap";
//import bootstrap-table

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';





const products = [ 
    { id: 1, name: 'George', price: 100 },
];
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

export default () =>
  <BootstrapTable keyField='id' data={ products } columns={ columns } />