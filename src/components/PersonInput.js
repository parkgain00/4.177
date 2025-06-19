import React, { useState, useEffect, useRef } from 'react';
import { getMaxDaysInMonth } from './Utils';

const PersonInput = ({ 
  label, 
  name, setName,
  year, setYear,
  month, setMonth,
  day, setDay,
  hour, setHour,
  minute, setMinute,
  isSimple,
  nameInputRef, yearInputRef, monthInputRef, dayInputRef, hourInputRef, minuteInputRef,
  onNameBlur, onYearBlur, onMonthBlur, onDayBlur, onHourBlur, onMinuteBlur,
  style,
  className,
  showRedThreadAnimation,
  checkboxSide,
  isFinalizing,
  unknownTime,
  setUnknownTime,
}) => {

  useEffect(() => {
    if (unknownTime) {
      setHour('');
      setMinute('');
    }
  }, [unknownTime, setHour, setMinute]);

  const handleUnknownTimeChange = (e) => {
    setUnknownTime(e.target.checked);
  };

  // 생년월일을 YYYY-MM-DD 형식으로 변환
  const getBirthDate = () => {
    if (year && month && day) {
      const paddedMonth = month.toString().padStart(2, '0');
      const paddedDay = day.toString().padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
    return '';
  };

  // 생년월일 변경 처리
  const handleBirthDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [newYear, newMonth, newDay] = dateValue.split('-');
      setYear(newYear);
    setMonth(newMonth);
      setDay(newDay);
    } else {
      setYear('');
      setMonth('');
      setDay('');
    }
  };

  // 시간을 HH:MM 형식으로 변환
  const getTimeValue = () => {
    if (hour && minute) {
      const paddedHour = hour.toString().padStart(2, '0');
      const paddedMinute = minute.toString().padStart(2, '0');
      return `${paddedHour}:${paddedMinute}`;
    }
    return '';
  };

  // 시간 변경 처리
  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    if (timeValue) {
      const [newHour, newMinute] = timeValue.split(':');
      setHour(newHour);
      setMinute(newMinute);
    } else {
      setHour('');
      setMinute('');
    }
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '30px'
  };

  const labelStyle = {
    position: 'absolute',
    top: '10px',
    left: '0',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    fontSize: '1rem',
    textShadow: '1px 1px 2px rgba(255,255,255,0.7)'
  };

  const inputStyle = {
    border: 'none',
    borderBottom: '1px solid #555',
    width: '100%',
    padding: '10px 0',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    color: '#333',
    transition: 'all 0.3s ease'
  };

  const focusedLabelStyle = {
    top: '-10px',
    fontSize: '0.8rem',
    color: '#c3142d'
  };

  return (
    <div className={`person-input ${className}`} style={style}>
      <h3 style={{
        fontFamily: "'Nanum Myeongjo', serif",
        textAlign: 'center',
        fontSize: '1.5rem',
        marginBottom: '2rem',
        fontWeight: '700',
        color: '#4a3737'
      }}>{label}</h3>
      
      {/* 이름 입력 */}
      <div style={inputGroupStyle}>
        <input 
          type="text" 
          id={`name-${label}`}
          name="name"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="이름을 입력하세요"
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderBottomColor = 'transparent';
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.style.borderBottomColor = '#555';
            }
          }}
        />
        <label htmlFor={`name-${label}`} style={{
          ...labelStyle,
          ...(name ? focusedLabelStyle : {})
        }}>이름</label>
      </div>

      {/* 생년월일 입력 */}
      <div style={inputGroupStyle}>
        <input 
          type="date" 
          id={`birth-${label}`}
          name="birth"
          value={getBirthDate()}
          onChange={handleBirthDateChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderBottomColor = 'transparent';
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.style.borderBottomColor = '#555';
            }
          }}
        />
        <label htmlFor={`birth-${label}`} style={{
          ...labelStyle,
          ...(getBirthDate() ? focusedLabelStyle : {})
        }}>생년월일</label>
      </div>

      {/* 태어난 시간 입력 */}
      <div style={inputGroupStyle}>
        <input 
          type="time" 
          id={`time-${label}`}
          name="time"
          value={getTimeValue()}
          onChange={handleTimeChange}
          disabled={unknownTime}
          required
          style={{
            ...inputStyle,
            opacity: unknownTime ? 0.5 : 1
          }}
          onFocus={(e) => {
            if (!unknownTime) {
              e.target.style.borderBottomColor = 'transparent';
            }
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.style.borderBottomColor = '#555';
            }
          }}
        />
        <label htmlFor={`time-${label}`} style={{
          ...labelStyle,
          ...(getTimeValue() ? focusedLabelStyle : {}),
          opacity: unknownTime ? 0.5 : 1
        }}>태어난 시간</label>
      </div>

      {/* 체크박스 */}
      <div style={{ marginTop: '2rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '1rem',
          justifyContent: checkboxSide === 'left' ? 'flex-start' : 'flex-end',
          color: '#333',
          fontWeight: 'bold'
        }}>
          {checkboxSide === 'right' ? (
            <>
              <span>태어난 시 모름</span>
        <input 
                type="checkbox" 
                checked={unknownTime} 
                onChange={handleUnknownTimeChange}
                style={{ marginLeft: '8px' }}
        />
            </>
          ) : (
        <>
            <input 
                type="checkbox" 
                checked={unknownTime} 
                onChange={handleUnknownTimeChange}
                style={{ marginRight: '8px' }}
            />
              <span>태어난 시 모름</span>
        </>
      )}
        </label>
      </div>
    </div>
  );
};

export default PersonInput; 