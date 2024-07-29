import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    FuseConfirmationModule,
    FuseConfirmationService,
} from '@fuse/services/confirmation';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatListModule } from '@angular/material/list';
import { fuseAnimations } from '@fuse/animations';

import { IssueForm } from '@core/models/issue';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@core/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from '@core/components/button/button.module';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EnumDuration } from '@core/config/app.enums';
import { TextEditorModule } from '@core/components/text-editor/text-editor.module';
import { items } from '../../../../mock-api/apps/file-manager/data';
import { MatCardModule } from '@angular/material/card';
import { TextEditorMarkdownModule } from '@core/components/text-editor-markdown/text-editor-markdown.module';
import { CategoriesService } from '../../../../services/categories.service';

export interface ModalIssueData {
    type?: 'update' | 'create';
    issue?: IssueForm;
}

interface ItemSelect {
    id?: number | string;
    name?: string;
}

interface ItemCategorySelect {
    id?: number;
    requerimentType?: string;
    anticipationDays?: number;
    resolutionTime?: number;
}

@Component({
    selector: 'app-modal-issue',
    templateUrl: './modal-issue.component.html',
    styleUrls: ['./modal-issue.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        FuseAlertModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatListModule,
        MatButtonModule,
        ButtonModule,
        FuseConfirmationModule,
        MatTooltipModule,
        MatSnackBarModule,
        TextEditorModule,
        MatCardModule,
        TextEditorMarkdownModule,
    ],
    animations: fuseAnimations,
    standalone: true,
})
export class ModalIssueComponent {
    public title: string = '';
    public issue: FormGroup;
    public visibleAlert: boolean = true;
    public yesterday = new Date();
    public docData: any[] = [];
    public fileList: FileList;
    public fileListArray: Array<any>;
    public contentHtml: string | undefined;
    public msgAlertCategory: string = '';

    priorities: ItemSelect[] = [
        { id: 'Alta', name: 'Alta' },
        { id: 'Media', name: 'Media' },
        { id: 'Baja', name: 'Baja' },
    ];

    categoriesList: any = [];
    selectedCategory;

    constructor(
        public dialogRef: MatDialogRef<ModalIssueComponent>,
        public _fuseConfirmationService: FuseConfirmationService,
        public fb: FormBuilder,
        public auth: AuthService,
        private _snackBar: MatSnackBar,
        private _categoryService: CategoriesService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: ModalIssueData
    ) {
        console.log('data', data);
        this.title =
            data.type === 'update' ? 'Actulizar ticket' : 'Generar ticket';
        const disctord_id = this.auth.getDiscordId();
        this.issue = this.fb.group({
            content: [data.issue.content, [Validators.required]],
            discordId: [disctord_id],
            duedate: [data.issue.duedate, [Validators.required]],
            summary: [data.issue.summary, [Validators.required]],
            attach: [data.issue.attach],
            category: [data.issue.category],
            contentHtml: [''],
        });
    }
    async ngOnInit(): Promise<void> {
        console.log('ngInit()');
        this._categoryService.getCategories().subscribe((result) => {
            console.log('result categories', result);
            this.categoriesList = result.data;
        });
    }
    onSelectionCategoryChange(e) {
        console.log('onSelectionCategoryChange', e);
        console.log('selectedCategory', this.selectedCategory);
        this.openDialog();
    }
    openDialog() {
        const message = `El tiempo de resolución es de ${this.selectedCategory.resolutionTime} días hábiles.`;
        const defaultMsg = `El tiempo de resolución depende de la naturaleza del requerimiento. \n 
    Requerimientos de mediana a baja complejidad: 2 días hábiles.`;
        const mData = {
            anticipationData: `El tiempo de anticipación que deben ser solicitados es de ${this.selectedCategory.anticipationDays} días.`,
            resolutionData:
                this.selectedCategory.resolutionTime === 0
                    ? defaultMsg
                    : message,
        };
        const dialogRef = this.dialog.open(AlertChoseCategoryComponent, {
            data: mData,
        });
    }

    onGenerate() {
        // Open the confirmation and save the reference
        const dialogRefC = this._fuseConfirmationService.open({
            title: 'Confirmación generación ticket',
            message: '¿esta segur@?',
            icon: { color: 'info', name: 'heroicons_outline:ticket' },
            actions: { confirm: { label: 'Si' }, cancel: { label: 'No' } },
            dismissible: false,
        });

        this.issue.get('contentHtml').setValue(this.contentHtml);
        // Subscribe to afterClosed from the dialog reference
        dialogRefC.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.dialogRef.close(this.issue.value);
            }
        });
    }

    showVisibleAlert(value?: boolean) {
        if (value !== undefined) {
            this.visibleAlert = value;
        } else {
            this.visibleAlert = !this.visibleAlert;
        }
    }

    getMessageError(field?: string) {
        if (this.issue.get(field).errors.required) {
            return 'campo obligatorio';
        }
        return '';
    }

    onChange(): void {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    fileChange(event: any, type: 'doc'): void {
        this.fileList = event.target.files;
        this.fileListArray = Array.from(this.fileList);
        console.log('-> fileListArray: ', this.fileListArray);
        if (this.fileList.length > 0 && this.fileList.length <= 5) {
            if (type === 'doc') {
                for (const item of this.fileListArray) {
                    const file: File = item;
                    if (
                        file.type === 'application/pdf' ||
                        file.type === 'application/doc' ||
                        file.type === 'application/msword' ||
                        file.type === 'application/docx' ||
                        file.type ===
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                        file.type === 'application/xls' ||
                        file.type === 'application/vnd.ms-excel' ||
                        file.type === 'application/xlsx' ||
                        file.type ===
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ) {
                        this.issue.patchValue({ attach: file });
                        const docFileReader = new FileReader();
                        const cvFile: File = this.issue.get('attach').value;
                        docFileReader.readAsDataURL(cvFile);
                        docFileReader.onload = async (e) => {
                            this.docData.push({
                                name: cvFile.name,
                                data: docFileReader.result,
                            });
                            this.issue.get('attach').setValue(this.docData);
                        };
                    } else {
                        this.issue.patchValue({ attach: undefined });
                        this._snackBar.open(
                            'Formato de archivo no valido 1.',
                            undefined,
                            {
                                duration: EnumDuration.default,
                            }
                        );
                    }
                }
            } else {
                this.issue.patchValue({ attach: undefined });
                this._snackBar.open(
                    'Formato de archivo no valido.',
                    undefined,
                    {
                        duration: EnumDuration.default,
                    }
                );
            }

            console.log('-> Issue: ', this.issue);
        } else {
            this.issue.patchValue({ attach: undefined });
            this._snackBar.open(
                'Excede la cantidad de archivos permitido.',
                undefined,
                {
                    duration: EnumDuration.default,
                }
            );
        }
    }

    onDragStart(event: any): void {
        event.dataTransfer.setData('file', event.target.id);
    }

    onDragOver(event: any): void {
        event.preventDefault();
    }

    onClearFile(type: 'doc'): void {
        const file: File | null = null;
        this.issue.patchValue({ attach: file });
        this.docData = [];
    }

    handleOutHtml(val: string): void {
        console.log('handleOutHtml() ==> val', { val });
        this.contentHtml = val;
    }
}

@Component({
    selector: 'alert-chose-category',
    templateUrl: './alertChoseCategory.html',
    imports: [MatDialogModule],
    standalone: true,
})
export class AlertChoseCategoryComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { anticipationData: string; resolutionData: string }
    ) {}
}
