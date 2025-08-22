import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Modal } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width } = Dimensions.get('window');

interface ProfessionalSignaturePadProps {
  style?: any;
  onSignatureChange?: (hasSignature: boolean) => void;
  onBegin?: () => void;
  onEnd?: () => void;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

interface SignaturePadRef {
  clearSignature: () => void;
  getSignature: () => string;
}

const ProfessionalSignaturePad = forwardRef<SignaturePadRef, ProfessionalSignaturePadProps>(({
  style,
  onSignatureChange,
  onBegin,
  onEnd,
  strokeWidth = 3,
  strokeColor = '#3B82F6',
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
}, ref) => {
  const signatureCanvasRef = useRef<any>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState(0);

  useEffect(() => {
    // Notify parent component about signature state
    if (onSignatureChange) {
      onSignatureChange(hasSignature);
    }
  }, [hasSignature, onSignatureChange]);

  // Ultra-aggressive PanResponder to prevent ALL gesture conflicts
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Block ANY movement that could trigger navigation
        return true;
      },
      onPanResponderRelease: () => {
        return true;
      },
      onPanResponderTerminate: () => {
        return true;
      },
      onPanResponderReject: () => {
        return true;
      },
    })
  ).current;

  const handleSignatureBegin = () => {
    setIsDrawing(true);
    setDrawingPoints(0);
    hapticService.trigger(HapticType.SELECTION, HapticIntensity.SUBTLE);
    if (onBegin) onBegin();
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
    hapticService.trigger(HapticType.SELECTION, HapticIntensity.SUBTLE);
    
    // Check if signature exists by counting drawing points
    if (drawingPoints > 5) {
      setHasSignature(true);
    } else {
      setHasSignature(false);
    }
    
    if (onEnd) onEnd();
  };

  const handleSignatureChange = (data: any) => {
    // This gets called during drawing to track signature progress
    if (data && data.length > 0) {
      setDrawingPoints(data.length);
      // If we have enough points, consider it a valid signature
      if (data.length > 5 && !hasSignature) {
        setHasSignature(true);
      }
    }
  };

  const clearSignature = () => {
    if (signatureCanvasRef.current && signatureCanvasRef.current.clear) {
      signatureCanvasRef.current.clear();
      setHasSignature(false);
      setDrawingPoints(0);
    }
  };

  const getSignature = () => {
    if (signatureCanvasRef.current && signatureCanvasRef.current.toDataURL) {
      return signatureCanvasRef.current.toDataURL();
    }
    return '';
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clearSignature,
    getSignature,
  }));

  const webStyle = `
    .m-signature-pad {
      margin: 0;
      box-shadow: none;
      border: none;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
      overscroll-behavior: none !important;
      -webkit-overflow-scrolling: touch !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 9999 !important;
    }
    .m-signature-pad--body {
      border: none;
      touch-action: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      overscroll-behavior: none !important;
      position: relative !important;
      z-index: 10000 !important;
    }
    .m-signature-pad--footer {
      display: none;
    }
    canvas {
      border-radius: 14px;
      border: none;
      stroke: ${strokeColor} !important;
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
      overscroll-behavior: none !important;
      position: relative !important;
      z-index: 10001 !important;
    }
    * {
      touch-action: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-touch-callout: none !important;
      overscroll-behavior: none !important;
    }
    body {
      overscroll-behavior: none !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: none !important;
      position: fixed !important;
      overflow: hidden !important;
    }
    html {
      overscroll-behavior: none !important;
      touch-action: none !important;
      overflow: hidden !important;
    }
    #root {
      overscroll-behavior: none !important;
      touch-action: none !important;
      overflow: hidden !important;
    }
  `;

  return (
    <>
      {/* Transparent overlay to capture all gestures when signing */}
      {isDrawing && (
        <View 
          style={styles.gestureOverlay}
          pointerEvents="box-none"
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
      
      <View 
        style={[styles.container, style, { backgroundColor }]}
        {...panResponder.panHandlers}
        onTouchStart={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        pointerEvents="box-none"
        collapsable={false}
      >
        <SignatureCanvas
          ref={signatureCanvasRef}
          webStyle={webStyle}
          dataURL=""
          minWidth={strokeWidth}
          maxWidth={strokeWidth + 2}
          backgroundColor="transparent"
          onBegin={handleSignatureBegin}
          onEnd={handleSignatureEnd}
          onOK={() => console.log('Signature OK')}
          onClear={() => console.log('Signature cleared')}
          onGetData={() => console.log('Getting signature data')}
          autoClear={false}
          descriptionText=""
          clearText=""
          confirmText=""
          imageType="image/png"
          style={styles.signatureCanvas}
        />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#0A0A0A',
    zIndex: 1002,
  },
  signatureCanvas: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gestureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
});

export default ProfessionalSignaturePad;
