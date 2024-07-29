import {CurrencyPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {FuseAlertComponent} from '@fuse/components/alert';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {SlideService} from "../../../../services/slide/slide.service";

@Component({
    selector: 'settings-plan-billing',
    templateUrl: './plan-billing.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, FuseAlertComponent, MatRadioModule, NgFor, NgClass, NgIf, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, CurrencyPipe, PdfViewerModule],
})
export class SettingsPlanBillingComponent implements OnInit {
    items: any;

    @Input()
    projectDos: any;

    /**
     * Constructor
     */
    constructor(
        private _project: SlideService
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    pdfSrc;

    responseFiles = []


    /**
     * On init
     */
    ngOnInit(): void {

        console.log(this.projectDos)
        this._project.findOneDocument(this.projectDos._id, 'Garantias').subscribe(data => {
            console.log(data)
            if (data) {
                console.log(data)
                data.forEach((val, index) => {
                    let name = val.file.split('/')[val.file.split('/').length - 1]
                    let item = {
                        id: index,
                        folderId: index,
                        name: name,
                        createdBy: '',
                        createdAt: '',
                        modifiedAt: '',
                        size: val.file,
                        type: name.split(".")[1],
                        contents: val.description,
                        description: val.type,
                    }
                    console.log(item)
                    this.responseFiles.push(item)
                })

                let itemsData = {folders: [], files: [], path: []};

                itemsData = {
                    //folders: folders,
                    folders: [],
                    files: this.responseFiles,
                    path: [],
                };
                console.log(itemsData)

                this.items = itemsData;
            }


        })

    }

    visualizerPdf(file: any) {
        this.pdfSrc = file.size
    }

    download(file) {
        window.open(file.size, "_blank");


    }
}
