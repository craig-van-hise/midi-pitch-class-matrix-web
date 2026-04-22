import React from 'react';

export interface PianoArrow {
    input: number;
    output: number;
}

interface Piano88Props {
    pianoArrows?: PianoArrow[];
}

/**
 * 88-Key MIDI Keyboard (A0 to C8)
 * - Fixed sizing: 1352px wide (52 white keys @ 26px each)
 * - SPN Notation: Middle C (60) is C4
 * - Performance: Direct DOM manipulation via updateKeyVisuals88
 */

const WHITE_KEY_WIDTH = 26;
const WHITE_KEY_HEIGHT = 120;
const BLACK_KEY_WIDTH = 15;
const BLACK_KEY_HEIGHT = 80;

const getKeyCenter = (note: number) => {
    let whiteIndex = 0;
    for (let i = 21; i < note; i++) {
        if (![1, 3, 6, 8, 10].includes(i % 12)) {
            whiteIndex++;
        }
    }
    const isBlack = [1, 3, 6, 8, 10].includes(note % 12);
    return isBlack ? whiteIndex * 26 : whiteIndex * 26 + 13;
};

const getKeyY = (note: number) => {
    return [1, 3, 6, 8, 10].includes(note % 12) ? 60 : 100;
};

export const Piano88: React.FC<Piano88Props> = ({ pianoArrows = [] }) => {
    const pianoKeys = [];

    // Range: A0 (MIDI 21) to C8 (MIDI 108)
    for (let note = 21; note <= 108; note++) {
        const noteInOctave = note % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);

        if (!isBlack) {
            const hasRightBlack = [0, 2, 5, 7, 9].includes(noteInOctave) && (note + 1 <= 108);
            const isC = noteInOctave === 0;
            const octave = Math.floor(note / 12) - 1; // SPN: MIDI 60 / 12 - 1 = C4

            pianoKeys.push(
                <div
                    key={`w-${note}`}
                    id={`pk88-${note}`}
                    style={{
                        width: `${WHITE_KEY_WIDTH}px`,
                        height: `${WHITE_KEY_HEIGHT}px`,
                        borderLeft: '1px solid #ccc',
                        borderRight: '1px solid #ccc',
                        backgroundColor: '#fff',
                        position: 'relative',
                        boxSizing: 'border-box',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexShrink: 0
                    }}
                >
                    {hasRightBlack && (
                        <div
                            id={`pk88-${note + 1}`}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                top: 0,
                                right: '-7.5px', // Centered on the seam (half of 15px)
                                width: `${BLACK_KEY_WIDTH}px`,
                                height: `${BLACK_KEY_HEIGHT}px`,
                                backgroundColor: '#3a3a3a',
                                borderBottom: '8px solid #050505',
                                borderLeft: '2px solid #050505',
                                borderRight: '2px solid #050505',
                                borderTop: 'none',
                                borderRadius: '0',
                                boxSizing: 'border-box'
                            }}
                        />
                    )}
                    {isC && (
                        <span style={{
                            fontSize: '10px',
                            fontFamily: 'sans-serif',
                            color: '#333',
                            marginBottom: '8px',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}>
                            C{octave}
                        </span>
                    )}
                </div>
            );
        }
    }

    return (
        <div style={{ overflowX: 'auto', padding: '20px' }}>
            <div
                style={{
                    display: 'flex',
                    width: '1352px', // 52 white keys * 26px
                    height: `${WHITE_KEY_HEIGHT}px`,
                    backgroundColor: '#fff',
                    borderTop: '2px solid #333',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    position: 'relative'
                }}
            >
                {pianoKeys}
                <svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 20
                    }}
                >
                    <defs>
                        <marker id="arrowhead-piano" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80" />
                        </marker>
                    </defs>
                    {pianoArrows.map((arrow, idx) => {
                        const startX = getKeyCenter(arrow.input);
                        const endX = getKeyCenter(arrow.output);
                        const startY = getKeyY(arrow.input);
                        const endY = getKeyY(arrow.output);
                        const cx = (startX + endX) / 2;
                        const cy = startY !== endY ? startY : startY - 40;
                        return (
                            <path
                                key={`${arrow.input}-${arrow.output}-${idx}`}
                                d={`M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`}
                                fill="transparent"
                                stroke="#4ade80"
                                strokeWidth="2.5"
                                strokeDasharray="3 3"
                                markerEnd="url(#arrowhead-piano)"
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

/**
 * Updates visuals for the 88-key component
 */
export const updateKeyVisuals88 = (note: number, color: string) => {
    const el = document.getElementById(`pk88-${note}`);
    if (!el) return;

    const isBlack = [1, 3, 6, 8, 10].includes(note % 12);

    if (color) {
        el.style.backgroundColor = color;
        el.style.boxShadow = `inset 0 -5px 10px rgba(0,0,0,0.1), 0 0 12px ${color}`;
        if (isBlack) el.style.zIndex = '11';
    } else {
        el.style.backgroundColor = isBlack ? '#3a3a3a' : '#fff';
        el.style.boxShadow = '';
        if (isBlack) el.style.zIndex = '10';
    }
};