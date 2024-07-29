import { Component, Input } from '@angular/core';
//import { FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent {
  @Input() control: any | undefined;
  @Input() isEditing: boolean = true;
  @Input() label: string | undefined;
  @Input() required: boolean | undefined;
  @Input() value: string | undefined;

  editorConfigDisabled: AngularEditorConfig = {
    sanitize: false,
    enableToolbar: false,
    showToolbar: false,
    editable: false,
    height: 'auto',
    minHeight: '12rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
  };
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '12rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: null,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fontName'],
      ['link', 'unlink', 'insertImage', 'insertVideo'],
    ],
  };

  constructor() {
    console.log('control', this.control);
  }

  getMessageError() {
    if (this.control.errors.required) {
      return 'campo obligatorio';
    }
    return '';
  }
}
