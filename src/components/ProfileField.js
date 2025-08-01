import React, { useState, useEffect } from 'react';
import '../styles/ProfileField.css';

function ProfileField({ label, value, onChange, type = 'text', options = [], placeholder = '' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Gelen value değişirse localValue da güncellenmeli
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Kalem ikonuna tıklayınca düzenleme moduna geç
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setLocalValue(value || ''); // Düzenlemeye başlarken değeri güncelle
  };

  // Değer değişince üst bileşene bildir
  const handleChange = (e) => {
    let val = e.target.value;
    setLocalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="profile-field">
      <label>{label}</label>

      {!isEditing && (
        <div className="field-display" onClick={toggleEdit} style={{ cursor: 'pointer' }}>
          {value ? (
            <>
              {value}
              <span className="edit-icon" title="Düzenle" style={{ marginLeft: 8, color: '#555' }}>
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
            <select value={localValue} onChange={handleChange} onBlur={toggleEdit} autoFocus>
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
