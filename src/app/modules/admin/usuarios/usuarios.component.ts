import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { QuillViewComponent } from "ngx-quill";
import { Subject } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "../../../services/alert.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { UserService } from "../../../services/user/user.service";
import * as CryptoJS from "crypto-js";
import { environment } from "../../../../environments/environment";
import { RolesService } from "../../../services/roles/roles.service";
import { CrearUsuariosComponent } from "./crearUsuarios/crearUsuarios.component";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent {
  data: any;
  dialogRef: MatDialogRef<any>;
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("editorText") editorText!: QuillViewComponent;
  calificaciones: any[] = [];
  budgetDetails: any = {
    columns: ["name", "user", "role", "status", "accion"],
  };
  estado: boolean = false;
  rowDetails: any = [];
  user: string = "";
  name: string = "";
  mail: string = "";
  tipo: any = [];
  editRegion: any = [];
  edit = false;
  dataregiones = [];
  title = "Agregar";
  botton = "Guardar";
  keyword = "role";

  progress = 0;
  imageUrlDesktop = "";
  message: any;

  previewMobil = "";
  preview = "";
  id: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  rol: any[];

  /**
   * Constructor
   */
  constructor(
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private rolService: RolesService,
    private readonly alertService: AlertService
  ) {
    this.getRoles();
  }

  ngOnInit(): void {
    this.getRegiones();
    this.getRoles();
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(CrearUsuariosComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRegiones();
      this.getRoles();
    });
    this.getRegiones();
    this.getRoles();
  }

  getRegiones() {
    this.userService.findAll().subscribe((data) => {
      console.log(data);
      data.sort(function (a, b) {
        var textA = new Date(a.updatedAt).getTime();
        var textB = new Date(b.updatedAt).getTime();
        return textA > textB ? -1 : textA < textB ? 1 : 0;
      });
      console.log(data);
      this.dataregiones = data;
      this.rowDetails = new MatTableDataSource(data);
      this.rowDetails.paginator = this.paginator;
      this._changeDetectorRef.markForCheck();
    });
  }

  getRoles() {
    let roles = [];
    this.rolService.findAll().subscribe((data) => {
      data.forEach((item) => {
        if (item.active === true) {
          roles.push(item);
        }
      });
      this.rol = roles;
    });

    // this.rol = this.rol.filter(data=> {data.active === true})
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  guardarRegion() {
    if (this.edit) {
      let email = this.validateEmail(this.mail.toString());
      if (
        this.name.length === 0 ||
        this.mail.length === 0 ||
        this.tipo === "3" ||
        email === false
      ) {
        this.name = "";
        this.user = "";
        this.mail = "";
        this.preview = "";
        this.tipo = "Selecciona un rol";
        this.previewMobil = "";
        this.botton = "Guardar";
        this.title = "Agregar";
        this.alertService.mensajeError(
          "No se guardo el registro, completa todos los datos"
        );
      } else {
        let edit = {
          _id: this.id,
          username: this.user,
          name: this.name,
          email: this.mail,
          rol: this.tipo,
          status: this.estado,
          statusGeneral: true,
        };

        this.userService.updateOneById(edit).subscribe((data) => {
          this.alertService.mensajeSuccess("Actualizado Correctamente");
          this.ngOnInit();
          this.name = "";
          this.user = "";
          this.mail = "";
          this.preview = "";
          this.tipo = "Selecciona un rol";
          this.estado = false;
          this.botton = "Guardar";
          this.title = "Agregar";
          this.dialogRef.afterClosed().subscribe((res) => {});
        });
      }

      this.edit = false;
    } else {
      let insert = {
        username: this.user,
        name: this.name,
        email: this.mail,
        rol: this.tipo,
        password: CryptoJS.AES.encrypt(
          this.autoCreate(),
          environment.keyEncrypt
        ).toString(),
        status: this.estado,
        statusGeneral: true,
        userVerified: false,
      };
      let email = this.validateEmail(this.mail.toString());
      if (
        insert.username.length === 0 ||
        insert.email.length === 0 ||
        insert.name.length === 0 ||
        insert.rol === "3" ||
        email === false
      ) {
        this.name = "";
        this.user = "";
        this.mail = "";
        this.preview = "";
        this.tipo = "Selecciona un rol";
        this.previewMobil = "";
        this.botton = "Guardar";
        this.title = "Agregar";
        this.alertService.mensajeError(
          "No se guardo el registro, completa todos los datos"
        );
      } else {
        this.userService.create(insert).subscribe((data) => {
          if (data.msm) {
            this.alertService.mensajeError(data.msm ? data.msm : data.message);
          } else {
            this.name = "";
            this.user = "";
            this.mail = "";
            this.preview = "";
            this.tipo = "Selecciona un rol";
            this.preview = "";
            this.previewMobil = "";
            this.preview = "";
            this.previewMobil = "";
            this.alertService.mensajeSuccess("Guardado Correctamente");
          }
          this.ngOnInit();

          this.name = "";
          this.user = "";
          this.mail = "";
          this.preview = "";
          this.tipo = "Selecciona un rol";
          this.previewMobil = "";
          this._changeDetectorRef.markForCheck();
        });
      }
    }
  }

  validateEmail(input: any) {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  editarRegion(element) {
    console.log(element);
    this.title = "Editar";
    this.botton = "Actualizar";
    this.name = element.name;
    this.user = element.username;
    this.mail = element.email;
    this.tipo = element.rol[0];
    this.estado = element.status;
    this.edit = true;
    this.id = element._id;
    this.openDialog(element);
  }

  eliminarRegion(element) {
    Swal.fire({
      title: "¿Deseas eliminar este campo?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero eliminar!",
      cancelButtonText: "Cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(element);

        let edit = {
          _id: element._id,
          statusGeneral: false,
        };

        this.userService.updateOneById(edit).subscribe((data) => {
          console.log(data);
          this.alertService.mensajeSuccess("Eliminado Correctamente");
          this.ngOnInit();
          this.name = "";
          this.user = "";
          this.mail = "";
          this.preview = "";
          this.tipo = "Selecciona un rol";
          this.estado = false;
          this.botton = "Guardar";
          this.title = "Agregar";
          this.dialogRef.afterClosed().subscribe((res) => {});
        });
      }
    });
  }

  cerrar() {
    this.edit = false;
    this.name = "";
    this.user = "";
    this.mail = "";
    this.preview = "";
    this.tipo = "Selecciona un rol";
    this.previewMobil = "";
    this.title = "Agregar";
    this.botton = "Guardar";
  }

  checkCheckBoxvalue(event) {
    this.estado = event.checked;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rowDetails.filter = filterValue.trim().toLowerCase();
    if (this.rowDetails.paginator) {
      this.rowDetails.paginator.firstPage();
    }
  }

  checkCheckBoxvalueId(event, val) {
    this.id = val._id;
    this.estado = event.checked;

    let update = {
      _id: this.id,
      message: event.message,
      imageUrlDesktop: event.imageUrlDesktop,
      imageUrlMobile: event.imageUrlMobile,
      active: this.estado,
    };
    this.userService.updateOneById(update).subscribe((data) => {
      console.log(data);
      this.alertService.mensajeSuccess("Actualizado Correctamente");
      this.getRegiones();

      this.botton = "Guardar";
      this.title = "Agregar";
      this._changeDetectorRef.markForCheck();
    });
  }

  getSelectedValue(item) {
    let val = [];
    let ids = item.target.value;

    this.rol.forEach((value) => {
      if (value._id === ids) {
        val = value;
      }
    });
    this.tipo = val;

    console.log(val);
  }

  autoCreate() {
    const chars =
      "$%&/!abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }

  selectEvent(item) {
    console.log(item);
    this.tipo = item ? item : "";
    item.deselect();
  }

  onChangeSearch(val: string) {
    console.log(val);
  }

  onFocused(e) {
    console.log(e);
  }
}
