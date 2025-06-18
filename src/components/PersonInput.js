import React, { useState, useEffect } from 'react';
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
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (unknownTime) {
      setHour('');
      setMinute('');
    }
  }, [unknownTime, setHour, setMinute]);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    const maxDays = getMaxDaysInMonth(year, newMonth);
    if (day > maxDays) {
      setDay(String(maxDays));
    }
  };

  const handleUnknownTimeChange = (e) => {
    setUnknownTime(e.target.checked);
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = (originalOnBlur, e) => {
    setFocusedInput(null);
    if (originalOnBlur) {
      originalOnBlur(e);
    }
  };

  return (
    <div className={`person-input ${className}`} style={style}>
      <div className={`form-view ${isFinalizing ? 'is-hiding' : ''}`}>
        <div className="label-container">
          {showRedThreadAnimation && (
            <svg className="red-thread-svg" viewBox="0 0 160 50">
              <path className="red-thread-path" d="M5,25 C 5,5 155,5 155,25 C 155,45 5,45 5,25" />
            </svg>
          )}
          <h3>{label}</h3>
        </div>
        <div className="input-group name-group">
          <input type="text" id={`name-${label}`} ref={nameInputRef} value={name} onChange={(e) => setName(e.target.value)} onFocus={() => handleFocus('name')} onBlur={(e) => handleBlur(onNameBlur, e)} placeholder=" " />
          <label htmlFor={`name-${label}`}>이름</label>
          <div className="underline"></div>
        </div>
        <div className="input-group">
          <input type="number" id={`year-${label}`} ref={yearInputRef} value={year} onChange={(e) => setYear(e.target.value)} onFocus={() => handleFocus('year')} onBlur={(e) => handleBlur(onYearBlur, e)} placeholder=" "/>
          <label htmlFor={`year-${label}`}>생년</label>
          <div className="underline"></div>
        </div>
        <div className="input-group">
          <input type="number" id={`month-${label}`} ref={monthInputRef} value={month} onChange={handleMonthChange} onFocus={() => handleFocus('month')} onBlur={(e) => handleBlur(onMonthBlur, e)} min="1" max="12" placeholder=" "/>
          <label htmlFor={`month-${label}`}>월</label>
          <div className="underline"></div>
        </div>
        <div className="input-group">
          <input type="number" id={`day-${label}`} ref={dayInputRef} value={day} onChange={(e) => setDay(e.target.value)} onFocus={() => handleFocus('day')} onBlur={(e) => handleBlur(onDayBlur, e)} min="1" max={getMaxDaysInMonth(year, month)} placeholder=" "/>
          <label htmlFor={`day-${label}`}>일</label>
          <div className="underline"></div>
        </div>
        <div className="time-input-container">
          <div className="input-group">
            <input type="number" id={`hour-${label}`} ref={hourInputRef} value={hour} onChange={(e) => setHour(e.target.value)} onFocus={() => handleFocus('hour')} onBlur={(e) => handleBlur(onHourBlur, e)} min="0" max="23" disabled={unknownTime} placeholder=" "/>
            <label htmlFor={`hour-${label}`}>시</label>
            <div className="underline"></div>
          </div>
          <div className="input-group">
            <input type="number" id={`minute-${label}`} ref={minuteInputRef} value={minute} onChange={(e) => setMinute(e.target.value)} onFocus={() => handleFocus('minute')} onBlur={(e) => handleBlur(onMinuteBlur, e)} min="0" max="59" disabled={unknownTime} placeholder=" "/>
            <label htmlFor={`minute-${label}`}>분</label>
            <div className="underline"></div>
          </div>
        </div>
        <div className="checkbox-group">
          <label>
            {checkboxSide === 'right' ? (
              <>
                <span>태어난 시 모름</span>
                <input type="checkbox" checked={unknownTime} onChange={handleUnknownTimeChange} style={{ marginLeft: '8px' }} />
              </>
            ) : (
              <>
                <input type="checkbox" checked={unknownTime} onChange={handleUnknownTimeChange} style={{ marginRight: '8px' }} />
                <span>태어난 시 모름</span>
              </>
            )}
          </label>
        </div>
      </div>
      {isFinalizing && (
        <div className="finalized-view">
          <div className="finalized-value">{name}</div>
          <div className="finalized-value">{year}<span className="unit"> 년</span></div>
          <div className="finalized-value">{month}<span className="unit"> 월</span></div>
          <div className="finalized-value">{day}<span className="unit"> 일</span></div>
          <div className="finalized-value">
            {unknownTime ? '시간모름' : <span>{hour}<span className="unit"> 시</span> {minute}<span className="unit"> 분</span></span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonInput; 