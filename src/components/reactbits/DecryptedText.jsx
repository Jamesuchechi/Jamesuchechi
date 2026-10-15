'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const getAvailableChars = () => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split('').filter(c => c !== ' '))).join('');
    }
    return characters;
  };

  const getNextIndex = (revealedSet) => {
    const textLen = text.length;
    switch (revealDirection) {
      case 'end':
        for (let i = textLen - 1; i >= 0; i--) {
          if (!revealedSet.has(i)) return i;
        }
        return null;
      case 'center': {
        const middle = Math.floor(textLen / 2);
        let offset = 0;
        while (offset <= middle) {
          const left = middle - offset;
          const right = middle + offset;
          if (left >= 0 && !revealedSet.has(left)) return left;
          if (right < textLen && !revealedSet.has(right)) return right;
          offset++;
        }
        return null;
      }
      case 'start':
      default:
        for (let i = 0; i < textLen; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return null;
    }
  };

  const triggerAnimation = () => {
    setIsScrambling(true);
    setRevealedIndices(new Set());
  };

  useEffect(() => {
    if (animateOn === 'view' && isInView) {
      triggerAnimation();
    }
  }, [isInView, animateOn]);

  useEffect(() => {
    if (!isScrambling) return;

    let intervalId;
    let currentIteration = 0;
    const available = getAvailableChars();

    intervalId = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        const newRevealed = new Set(prevRevealed);

        if (sequential) {
          if (newRevealed.size < text.length) {
            const nextIdx = getNextIndex(newRevealed);
            if (nextIdx !== null) {
              newRevealed.add(nextIdx);
            }
          } else {
            clearInterval(intervalId);
            setIsScrambling(false);
            setDisplayText(text);
            return newRevealed;
          }
        } else {
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(intervalId);
            setIsScrambling(false);
            setDisplayText(text);
            return new Set(Array.from({ length: text.length }, (_, i) => i));
          }
        }

        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (newRevealed.has(index)) return char;
              const randomIndex = Math.floor(Math.random() * available.length);
              return available[randomIndex] || char;
            })
            .join('');
        });

        return newRevealed;
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [isScrambling, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovering(true);
      triggerAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (animateOn === 'hover') {
      setIsHovering(false);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block cursor-default ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {displayText.split('').map((char, index) => {
          const isRevealed = revealedIndices.has(index) || !isScrambling;
          return (
            <span
              key={index}
              className={isRevealed ? undefined : encryptedClassName || 'text-cyan-400/80 font-mono'}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
