// @flow
import { toArray, isArray, isSchema } from "./utils";

type TransformValueFunction = (
  value: any,
  options: Object,
  paramName: string,
  paramPath: string
) => any;

type MapValuesFunction = (
  values: Object,
  params: Object,
  transformValueFn: TransformValueFunction,
  paramNames?: any[]
) => Object;

const mapValues: MapValuesFunction = (
  values,
  params,
  transformValueFn,
  paramNames = []
) =>
  Object.keys(params).reduce((finalParams, paramName) => {
    console.log("init",finalParams, paramName)
    const options = params[paramName];
    const value = values[paramName];
    const paramPath = [...paramNames, paramName].join(".");
    const mergeParam = finalValue => ({
      ...finalParams,
      [paramName]: finalValue
    });
    if (isArray(options.type)) {
      console.log("isArray")
      const [opt] = options.type;
      console.log("type",options.type)
      const finalValue = value?toArray(value).map((val, i) =>
        {
          console.log("finalValue",val, i,paramPath)
          return transformValueFn(val, opt, paramName, [paramPath, i].join("."))
        }
      ):null;
      return mergeParam(finalValue);
    }

    if (isSchema(options.type)) {
      console.log("isSchema")
      return mergeParam(
        mapValues(value, options.type.params, transformValueFn, [paramPath])
      );
    }

    return mergeParam(transformValueFn(value, options, paramName, paramPath));
  }, {});

export default mapValues;
