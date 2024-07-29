import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { MdEditorOption } from 'ngx-markdown-editor';
//import { FormControl } from '@angular/forms';
//import { ToolbarItemName } from '@mdefy/ngx-markdown-editor';

@Component({
  selector: 'app-text-editor-markdown',
  templateUrl: './text-editor-markdown.component.html',
  styleUrls: ['./text-editor-markdown.component.scss'],
})
export class TextEditorMarkdownComponent implements OnInit {
  @Input() required: boolean | undefined;
  @Input() label: string | undefined;
  @Input() tooltip: string | undefined;
  @Input() data: any | undefined;
  @Input() value: string | undefined;
  @Input() typeView: 'onlyView' | 'onlyEdit' | 'viewAndEdit' = 'viewAndEdit';
  @Output() handleOutHtml: EventEmitter<string> = new EventEmitter<string>();

  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    resizable: true,
    fontAwesomeVersion: '4',
    markedjsOpt: {
      sanitize: true,
      breaks: true,
      gfm: true,
    },
    customIcons: {
      //Heading: { fontClass: 'fa-solid fa-heading' },
    },
  };
  public content: string;
  public mode: string = 'editor';

  constructor(private markdownService: MarkdownService) {
    console.log('control', { data: this.data });
  }

  ngOnInit(): void {
    //this.data = this.data ?? new FormControl();
    this.content = this.value;
  }

  onReady(): void {
    console.log('onReady() => data', { data: this.data });
  }

  getMessageError(): string {
    if (this.data.errors.required) {
      return 'campo obligatorio';
    }
    return '';
  }

  changeMode(): void {
    if (this.mode === 'editor') {
      this.mode = 'preview';
    } else {
      this.mode = 'editor';
    }
  }

  onChange(event?: string): void {
    console.log('onChange() ==>', { event });
    this.handleOutHtml.emit(this.markdownService.parse(event));
    this.data.setValue(event);
    //this.content = event;
  }

  onEditorLoaded(editor) {
    console.log('ACE Editor Ins: ', editor);
    //editor.setOption('showLineNumbers', true);

    (document.styleSheets[2].rules[15] as any).style.font = '';
    setTimeout(() => {
      editor.setShowPrintMargin(false);
      editor.setOption('showLineNumbers', true);
      (document.styleSheets[2].rules[15] as any).style.font =
        '12px Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace';
    }, 2000);
  }

  preRender(mdContent) {
    console.log('preRender fired');
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(mdContent);
    //   }, 4000);
    // })
    return mdContent;
  }

  postRender(html) {
    console.log('postRender fired');
    // return '<h1>Test</h1>';
    return html;
  }

  onPreviewDomChanged(dom: HTMLElement) {
    console.log('onPreviewDomChanged fired');
    // console.log(dom);
    // console.log(dom.innerHTML)
  }
}
