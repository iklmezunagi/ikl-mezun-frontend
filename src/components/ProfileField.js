import React, { useState, useEffect } from 'react';
import '../styles/ProfileField.css';

function ProfileField({ label, value, onChange, type = 'text', options = [], placeholder = '' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Dışarıdan value değişirse güncelle
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Düzenleme modunu aç/kapa
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setLocalValue(value || '');
  };

  // Input veya textarea değişince üst bileşene bildir
  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    if (onChange) onChange(val);
  };

  // Radio buttonlar için özel render
  const renderRadioButtons = () => {
    if (options.length === 0) return null;

    return options.map((opt, i) => (
      <label key={i} style={{ marginRight: '20px', cursor: 'pointer' }}>
        <input
          type="radio"
          name={label.replace(/\s+/g, '')} // unique name için boşlukları kaldırdık
          value={opt}
          checked={localValue === opt}
          onChange={() => {
            setLocalValue(opt);
            if (onChange) onChange(opt);
          }}
        />
        {' '}{opt}
      </label>
    ));
  };

  return (
    <div className="profile-field">
      <label>{label}</label>

      {!isEditing && (
        <div
          className="field-display"
          onClick={toggleEdit}
          style={{ cursor: 'pointer' }}
          title="Düzenlemek için tıklayın"
        >
          {value ? (
            <>
              {value}
              <span
                className="edit-icon"
                title="Düzenle"
                style={{ marginLeft: 8, color: '#555', userSelect: 'none' }}
              >
                &#9998;
              </span>
            </>
          ) : (
            <i style={{ color: '#999' }}>Belirtilmemiş</i>
          )}
        </div>
      )}

      {isEditing && (
        <>
          {type === 'radio' && renderRadioButtons()}

          {type === 'textarea' && (
            <textarea
              value={localValue}
              onChange={handleChange}
              onBlur={toggleEdit}
              autoFocus
              rows={4}
              placeholder={placeholder}
            />
          )}

          {type === 'select' && (
            <select
              value={localValue}
              onChange={handleChange}
              onBlur={toggleEdit}
              autoFocus
            >
              <option value="">Seçiniz</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {(type === 'text' || type === 'tel' || type === 'number') && (
            <input
              type={type}
              value={localValue}
              onChange={handleChange}
              onBlur={toggleEdit}
              autoFocus
              placeholder={placeholder}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileField;
