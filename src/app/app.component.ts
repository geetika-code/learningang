import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  RowModelType,
} from 'ag-grid-community';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private readonly env = environment;
  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
  ];
  public rowModelType: RowModelType = 'infinite';
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  public infiniteInitialRowCount = 1000;
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private http: HttpClient) {}

  // Example load data from server
  onGridReady(params: any) {
    this.http.get(this.env.BACKEND_URL).subscribe((data: any) => {
      const dataSource = {
        rowCount: undefined,
        getRows: (params: any) => {
          console.log('asking for ' + params.startRow + ' to ' + params.endRow);
          // At this point in your code, you would call the server.
          // To make the demo look real, wait for 500ms before returning
          setTimeout(function () {
            // take a slice of the total rows
            const rowsThisPage = data.slice(params.startRow, params.endRow);
            // if on or after the last page, work out the last row.
            let lastRow = -1;
            if (data.length <= params.endRow) {
              lastRow = data.length;
            }
            // call the success callback
            params.successCallback(rowsThisPage, lastRow);
          }, 2000);
        },
      };
      params.api!.setDatasource(dataSource);
    });
  }

  // Example of consuming Grid Event
  onCellClicked(e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
}
