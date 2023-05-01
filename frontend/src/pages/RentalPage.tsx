import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { User } from '../models/user';
import { Container } from 'react-bootstrap';
import RetrieveAllRentalsView from '../components/rental/RetrieveAllRentalsView';

const RentalPage = () => {
  return (
    <Container>
      
    {<RetrieveAllRentalsView />}
      
    </Container>
  );
};

export default RentalPage;