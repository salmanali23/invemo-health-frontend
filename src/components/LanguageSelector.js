import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LanguageSelectorWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageSelectorWrapper>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        style={{
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          background: '#fff',
          color: '#333',
          cursor: 'pointer',
        }}
      >
        <option value="en-US">English</option>
        <option value="es">Español</option>
      </select>
    </LanguageSelectorWrapper>
  );
};

export default LanguageSelector;
