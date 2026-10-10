import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Phone, Search } from 'lucide-react';

const AutocompleteInput = ({
  label,
  name,
  value,
  onChange,
  onSelectSuggestion,
  field, // 'userId' or 'phone'
  placeholder,
  required = true,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value && value.trim().length >= 1) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `/api/bills/suggest?field=${field}&q=${encodeURIComponent(value.trim())}`
          );
          setSuggestions(data);
          setIsOpen(data.length > 0);
        } catch (err) {
          console.error('Autocomplete query error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value, field]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectSuggestion(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: 1 }}>
      <label style={{
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
        marginBottom: '0.4rem'
      }}>
        {label} {required && <span style={{ color: 'var(--accent-rose)' }}>*</span>}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingRight: loading ? '2.5rem' : '1rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />

        {loading && (
          <div style={{
            position: 'absolute',
            right: '0.8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)'
          }}>
            ...
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.3rem',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 200,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--accent-cyan)" />
                  {item.username}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ID: <span style={{ color: 'var(--text-main)' }}>{item.userId}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={12} />
                {item.phoneNumber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
