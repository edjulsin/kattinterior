import React from 'react';

export default ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        stroke='currentColor'
        className={ className }
    >
        <g fill="none" fillRule="evenodd">
            <circle cx="20" cy="20" r="18" strokeOpacity="0.2" strokeWidth="4" />
            <circle cx="20" cy="20" r="18" strokeWidth="4" strokeDasharray='25 75' strokeDashoffset='0' strokeLinecap='round' pathLength='100'>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 20 20"
                    to="360 20 20"
                    dur="1.2s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    </svg>
)