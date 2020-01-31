/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import {
  LitElement,
  html,
  css
} from "./node_modules/lit-element/lit-element.js";
import "./node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
/**
 * `glossary-term`
 * `Glossary term that shows a popup for the answer`
 * @demo demo/index.html
 * @customElement glossary-term
 */
class PrintPdf extends LitElement {
  // styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }

        button {
          display: flex;
          align-items: center;
        }

        elmsln-loading {
          margin-inline-start: 10px;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <button @click=${this.__click}>${this.__renderText()}</button>
    `;
  }

  __renderText() {
    if (this.printing) {
      return html`
        Printing <elmsln-loading size="small"></elmsln-loading>
      `;
    } else {
      return html`
        <slot></slot>
      `;
    }
  }

  async __click(e) {
    this.printing = true;
    let formData = new FormData();
    formData.append('remoteURL', this.url)
    formData.append('marginTop', '0')
    formData.append('marginLeft', '0')
    formData.append('marginRight', '0')
    formData.append('marginBottom', '0')
    const blob  = await fetch(this.endpoint, {
      method: "POST",
      mode: 'no-cors',
      // headers: { "Content-Type": "multipart/form-data" },
      body: formData
    })
      .then(res => res)

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = data;
    link.download="file.pdf";
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      this.printing = false;
    }, 100);
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      endpoint: {
        type: String
      },
      url: {
        type: String
      },
      printing: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.endpoint = "";
    this.url = window.location.href;
    this.printing = false;
  }
  // updated(changedProperties) {
  //   changedProperties.forEach((oldValue, propName) => {
  //     if (["endpoint", "url"].includes(propName)) {
  //       this.__endpointMethodChanged(this.endpoint, this.serviceType);
  //     }
  //   });
  // }
  /**
   * convention
   */
  static get tag() {
    return "print-pdf";
  }
}
window.customElements.define(PrintPdf.tag, PrintPdf);

export { PrintPdf };
