import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import {CrearUsuariosComponent} from "../../usuarios/crearUsuarios/crearUsuarios.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {UserService} from "../../../../services/user/user.service";
import {RolesService} from "../../../../services/roles/roles.service";
import {AlertService} from "../../../../services/alert.service";
import {DetallesClienteComponent} from "../detalles/detallesCliente.component";

@Component({
  selector: 'table-cliente',
  templateUrl: './table-cliente.component.html',
  styleUrls: ['./table-cliente.component.scss']
})
export class TableClienteComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() masterName;
  displayedColumns: string[] = ['id'];
  dataSource = null;
  sohers = 0;
    constructor(
        public dialog: MatDialog,
    ) {
    }
  ngOnInit() {
      console.log(this.masterName)

    this.dataSource = new MatTableDataSource(this.masterName);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    this.sohers = this.masterName.length;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.paginator = this.masterName.length;
    }, 0);
  }

    openDialog(element): void {
        const dialogRef = this.dialog.open(DetallesClienteComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {

        });

    }
}
