import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Select, Button, Popover, IconButton } from '@looker/components';
import { CustomArrowIcon } from './CustomArrowIcon';
import { Filter, useExpressionState, useSuggestable } from '@looker/filter-components';
import styled from 'styled-components';
import './customStyles.css';
import { set } from 'lodash';


const FlexButton = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  gap: 10px;
  max-width: 313px;
  width: 100%;
  min-width: 100px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  flex: none;
  order: 0;
  flex-grow: 1;
  cursor: pointer;

`;

const StyledFilter = styled(Filter)`
  /* Add your custom styles here */
  background-color: #0891b3;
  padding: 10px;
  border-radius: 5px;
  max-width: 313px;
  --ripple-color: #0891b3;
`;

const FieldCount = styled.span`
  font-size: 12px;
  background: #F3F4F6;
  padding: 4px 8px;
  margin-right: 8px;
`

export const PopoverFilter = ({ index, filter, sdk, changeHandler, expression, nameForAllCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stateProps, setStateProps] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  // useRef for previous values
  const previousValues = useRef();

  const { errorMessage, suggestableProps } = useSuggestable({
    filter,
    sdk,
  });

  useEffect(() => {
    if (suggestableProps?.suggestions?.length > 0 && suggestions.length === 0) {
      // console.log('Setting suggestions:', suggestableProps.suggestions);
      setSuggestions(suggestableProps.suggestions)
    }
  }
    , [suggestableProps.suggestions, expression]);

  const { id, name = '', type, field, ui_config } = filter;

  const customSuggestions = ((ui_config.type === 'checkboxes' || ui_config.type === 'tag_list') && nameForAllCategories.length > 0) ?
    suggestions ? [nameForAllCategories, ...suggestions] : [nameForAllCategories] :
    suggestions;

  const extendedSuggestableProps = {
    ...suggestableProps,
    suggestions: customSuggestions,
  };


  const handleFilterChange = useCallback((value) => {
    // console.log('handleFilterChange value:', value, 'previousValues:', previousValues.current);
    if (ui_config.type === 'checkboxes' || ui_config.type === 'tag_list') {
      const valueArray = value.split(',');
      console.log('0. starting valuearray, previous, name', valueArray, previousValues.current, nameForAllCategories);
      let newValue = value
      // if the value array includes the ALL and the previousValues does not include the ALL
      // add the ALL to the end of the possible values
      if (valueArray?.includes(nameForAllCategories) && (!previousValues.current?.includes(nameForAllCategories) || !previousValues)) {
        console.log('1. valueArray includes nameForAllCategories:', valueArray);
        newValue = suggestions.join(',') + ',' + nameForAllCategories;
      }
      // if the value array does not include the ALL and the previousValues includes the ALL
      // remove all values and set to empty string
      else if (!valueArray?.includes(nameForAllCategories) && previousValues.current?.includes(nameForAllCategories)) {
        console.log('2. valueArray does not include nameForAllCategories:', valueArray);
        newValue = '';
      } else if (previousValues.current && previousValues.current?.includes(nameForAllCategories)) {
        const newValuesWithoutAllCategories = valueArray.filter(val => val !== nameForAllCategories);
        console.log('3. newValuesWithoutAllCategories:', newValuesWithoutAllCategories);
        newValue = newValuesWithoutAllCategories.join(',');
      }
      // Check if the values are the same as the suggestions
      else if (valueArray.length === suggestions.length) {
        console.log('4. valueArray matches suggestions:', valueArray);
        newValue = suggestions.join(',') + ',' + nameForAllCategories;
      }
      else {
        console.log('5. valueArray:', valueArray);
      }
      previousValues.current = newValue;
      changeHandler(newValue);

    } else {
      changeHandler(value);
      previousValues.current = newValue;
    };
  }, [suggestions, changeHandler])

  const onChange = handleFilterChange
  const newStateProps = useExpressionState({
    filter,
    expression,
    onChange,
  });

  useEffect(() => {
    setStateProps(newStateProps);
  }, [suggestions])

  // create an effect to watch and log the state props
  useEffect(() => {
    // console.log('Updated state props in Popover Filter component:', stateProps);
  }, [stateProps]);

  // track prevoius values state changes
  useEffect(() => {
    // console.log('Updated previous values in Popover Filter component:', previousValues);
  }, [previousValues]);

  useEffect(() => {
    // console.log('Updated filter values in Popover Filter component:', expression);
    if (expression !== stateProps.expression) {
      const newStateProps = { ...stateProps }
      newStateProps.expression = expression;
      setStateProps(newStateProps);
    }
  }, [expression]);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fieldCountNumber = stateProps.expression ? stateProps.expression.split(',').length : 0;

  return (
    <div key={index}>

      <Popover
        width="313px"
        placement='bottom-start'
        content={
          <StyledFilter
            name={name}
            type={type}
            field={field}
            config={ui_config}
            {...extendedSuggestableProps}
            {...stateProps}
          />
        }
        isOpen={isOpen}
        triggerElement={anchorEl}
        onClose={handleClose}
      >
        <FlexButton onClick={handleClick}>
          <span>{filter.name}</span>
          <span>
            {fieldCountNumber > 0 && (
              <FieldCount>{stateProps.expression ? stateProps.expression.split(',').length : 0}</FieldCount>
            )}
            <CustomArrowIcon />
          </span>
        </FlexButton>
      </Popover>
    </div>
  )
}


export default PopoverFilter;