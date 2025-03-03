import { formDataMap, rulesMap } from "../config/validator.config"
import Validator from "validator.tool"
export default class FormValidator {
    constructor(formType) {
        this.formType = formType
        //返回Promise对象，方便链式调用
        return this.generateValidator()
    }
    //第三方Validator类
    generateValidator() {
        let rules = this.toFormRules()
        return new Promise((resolve, reject) => {
            let validator = new Validator(this.formType, rules, (obj, evt) => {
                if (obj.errors.length === 0) {
                    $("[data-display]").removeAttr("data-error-msg")
                    let formData = Object.entries(obj.fields).reduce((acc, [key, value]) => {
                        acc[key] = value.value
                        return acc
                    }, {})
                    resolve(formData)
                } else {
                    $("[data-display]").removeAttr("data-error-msg")
                    $(obj.errors[0].element).focus()
                    obj.errors.forEach(({ element, display }) => {
                        $(element).parent().attr("data-error-msg", display)
                    })
                    reject(obj.errors)
                }
            })
            validator.validate()
        })

    }
    //生成表单以及对相应规则
    toFormRules() {
        let names = formDataMap[this.formType]
        return names.map((key) => {
            return {
                name: key,
                ...(rulesMap[key])
            }
        })
    }
}