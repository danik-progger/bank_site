import renderService from "@/core/services/render.service";

import template from "./auth-required-message.template.html";
import styles from "./auth-required-message.module.scss";
import ChildComponent from "@/core/component/child.component";

export class AuthRequiredMessage extends ChildComponent {
  render() {
    const element = renderService.htmlToElement(template, [], styles)
    return element
  }
}