import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../atoms/Loader";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";
import { createFunction } from "./techMolecules/createFunction";

const CustomDropdown = ({ t, config, inputRef, label, onChange, value, errorStyle, disable, type, additionalWrapperClass = "" }) => {
  const master = { name: config?.mdmsConfig?.masterName };
  if (config?.mdmsConfig?.filter) {
    master["filter"] = config?.mdmsConfig?.filter;
  }

  const { isLoading, data } = window?.Digit?.Hooks.useCustomMDMS(Digit?.ULBService?.getStateId(), config?.mdmsConfig?.moduleName, [master], {
    select: config?.mdmsConfig?.select
      ? createFunction(config?.mdmsConfig?.select)
      : (data) => {
          const optionsData = _.get(data, `${config?.mdmsConfig?.moduleName}.${config?.mdmsConfig?.masterName}`, []);
          return optionsData
            .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
            .map((opt) => ({ ...opt, name: `${config?.mdmsConfig?.localePrefix}_${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
        },
    enabled: config?.mdmsConfig ? true : false,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment key={config.name}>
      {type === "radio" ? (
        <RadioButtons
          inputRef={inputRef}
          style={{ display: "flex", justifyContent: "flex-start", gap: "3rem", ...config.styles }}
          options={data || config?.options || []}
          key={config.name}
          optionsKey={config?.optionsKey}
          value={value}
          onSelect={(e) => {
            onChange(e, config.name);
          }}
          disable={disable}
          selectedOption={value}
          defaultValue={value}
          t={t}
          errorStyle={errorStyle}
          additionalWrapperClass={additionalWrapperClass}
          innerStyles={config?.innerStyles}
        />
      ) : (
        <Dropdown
          inputRef={inputRef}
          style={{ display: "flex", justifyContent: "space-between", ...config.styles }}
          option={data || config?.options || []}
          key={config.name}
          optionKey={config?.optionsKey}
          value={value}
          select={(e) => {
            onChange(e, config.name);
          }}
          disable={disable}
          selected={value || config.defaultValue}
          defaultValue={value || config.defaultValue}
          t={t}
          errorStyle={errorStyle}
          optionCardStyles={config?.optionsCustomStyle}
        />
      )}
    </React.Fragment>
  );
};

CustomDropdown.propTypes = {
  t: PropTypes.func.isRequired,
  config: PropTypes.shape({
    mdmsConfig: PropTypes.shape({
      masterName: PropTypes.string,
      moduleName: PropTypes.string,
      filter: PropTypes.object,
      select: PropTypes.string,
      localePrefix: PropTypes.string,
    }),
    name: PropTypes.string,
    optionsKey: PropTypes.string,
    styles: PropTypes.object,
    innerStyles: PropTypes.object,
    options: PropTypes.array,
    defaultValue: PropTypes.string,
    optionsCustomStyle: PropTypes.object,
    required: PropTypes.bool,
  }),
  inputRef: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  errorStyle: PropTypes.object,
  disable: PropTypes.bool,
  type: PropTypes.string,
  additionalWrapperClass: PropTypes.string,
};

export default CustomDropdown;
