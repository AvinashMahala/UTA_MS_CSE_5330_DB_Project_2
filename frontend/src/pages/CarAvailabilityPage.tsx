import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { User } from '../models/user';
import { Container } from 'react-bootstrap';
import RetrieveAllCarsAvailabilityView from '../components/carAvailability/RetrieveAllCarsAvailabilityView';

const CarAvailabilityPage = () => {
  return (
    <Container>
      
    {<RetrieveAllCarsAvailabilityView />}
      
    </Container>
  );
};

export default CarAvailabilityPage;