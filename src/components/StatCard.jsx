import React from 'react';

const StatCard = ({ icon, label, value, trend, trendLabel, color = 'purple' }) => {
  const colorMap = {
    purple: { bg: 'var(--primary-light)', icon: 'var(--primary)' },
    green:  { bg: 'var(--green-bg)',      icon: 'var(--green)'   },
    yellow: { bg: 'var(--yellow-bg)',     icon: 'var(--yellow)'  },
    red:    { bg: 'var(--red-bg)',        icon: 'var(--red)'     },
    blue:   { bg: 'var(--blue-bg)',       icon: 'var(--blue)'    },
    orange: { bg: 'var(--orange-bg)',     icon: 'var(--orange)'  },
  };
  const c = colorMap[color] || colorMap.purple;
  const isPositive = trend > 0;
  const isNeutral = trend === 0 || trend === undefined;

  return (
    <div className="stat-card card card-padded">
      <div className="stat-card__top">
        <div className="stat-card__icon" style={{ background: c.bg, color: c.icon }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`stat-card__trend ${isNeutral ? 'neutral' : isPositive ? 'up' : 'down'}`}>
            {isPositive ? '↑' : isNeutral ? '→' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {trendLabel && <div className="stat-card__trend-label">{trendLabel}</div>}
    </div>
  );
};

export default StatCard;
