import React, { useState, useEffect, useRef } from 'react';

interface BotaoComandoProps {
  id: string;
  texto: string | React.ReactNode;
  destaque?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  className?: string;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
}

const Botao_Comando: React.FC<BotaoComandoProps> = ({
  id,
  texto,
  destaque = false,
  onClick,
  onLongPress,
  className,
  posX = 0,
  posY = 0,
  width = 244,
  height = 40,
}) => {
  const [pressionado, setPressionado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const intervaloRef = useRef<number | null>(null);
  const tempoTotalCarregamento = 3000; // 3 segundos
  const intervaloAtualizacao = 50; // Atualiza a cada 50ms

  useEffect(() => {
    if (pressionado && !concluido) {
      setCarregando(true);
      let tempoDecorrido = 0;
      intervaloRef.current = window.setInterval(() => {
        tempoDecorrido += intervaloAtualizacao;
        const novoProgresso = Math.min(100, (tempoDecorrido / tempoTotalCarregamento) * 100);
        setProgresso(novoProgresso);

        if (novoProgresso >= 100) {
          clearInterval(intervaloRef.current!);
          setConcluido(true);
          setCarregando(false);
          if (onLongPress) onLongPress();
        }
      }, intervaloAtualizacao);
    } else if (!pressionado) {
      if (intervaloRef.current !== null) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      if (!concluido) {
        setCarregando(false);
        setProgresso(0);
      }
    }
    return () => {
      if (intervaloRef.current !== null) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [pressionado, concluido, onLongPress]);

  useEffect(() => {
    if (concluido) {
      const timeoutId = setTimeout(() => {
        setConcluido(false);
        setProgresso(0);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [concluido]);

  const handleMouseDown = () => setPressionado(true);
  const handleMouseUp = () => {
    setPressionado(false);
    if (!carregando && !concluido && onClick) onClick();
  };
  const handleMouseLeave = () => setPressionado(false);

  // Função que define o background do botão com gradientes modernos
  const getBotaoBackground = () => {
    if (concluido) return 'linear-gradient(135deg, #4ade80, #22c55e)';
    if (carregando) {
      return `linear-gradient(135deg, #f59e0b 0%, #f59e0b ${progresso}%, ${destaque ? '#fbbf24' : '#ffffff'} ${progresso}%, ${destaque ? '#fbbf24' : '#ffffff'} 100%)`;
    }
    if (pressionado) return 'linear-gradient(135deg, #f97316, #ea580c)';
    if (destaque) return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
    return 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
  };

  // Define a cor do texto de forma a garantir contraste e modernidade
  const getTextColor = () => {
    if (concluido) return '#1e293b';
    if (carregando) return '#1e293b';
    if (pressionado) return '#1e293b';
    if (destaque) return '#1e293b';
    return '#1e293b';
  };

  // Ajusta o tamanho da fonte com base na altura do botão
  const getFontSize = () => {
    if (height > 60) return '18px';
    return '17px';
  };

  return (
    <div
      id={id}
      className={`relative ${className || ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        transform: `translate(${posX}px, ${posY}px)`,
        transition: 'transform 0.2s ease',
      }}
    >
      <button
        className="rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: '12px',
          border: 'none',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          background: getBotaoBackground(),
          color: getTextColor(),
          position: 'relative',
          textAlign: 'center',
          fontSize: getFontSize(),
          letterSpacing: '0.75px',
          overflow: 'hidden',
          transform: pressionado ? 'scale(0.98)' : 'scale(1)',
          boxShadow: pressionado
            ? 'inset 0 3px 6px rgba(0, 0, 0, 0.15)'
            : '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {texto}
      </button>
    </div>
  );
};

export default Botao_Comando;
