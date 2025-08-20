import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, G } from 'react-native-svg';

interface ExpoSignatureCanvasProps {
  style?: any;
  onSignatureChange?: (hasSignature: boolean) => void;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

interface Point {
  x: number;
  y: number;
}

interface SignatureCanvasRef {
  clearSignature: () => void;
}

const ExpoSignatureCanvas = forwardRef<SignatureCanvasRef, ExpoSignatureCanvasProps>(({
  style,
  onSignatureChange,
  strokeWidth = 3,
  strokeColor = '#FFFFFF',
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
}, ref) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Notify parent component about signature state
    if (onSignatureChange) {
      onSignatureChange(paths.length > 0 || currentPath.length > 0);
    }
  }, [paths, currentPath, onSignatureChange]);

  const addPoint = (x: number, y: number) => {
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const finishPath = () => {
    if (currentPath.length > 1) {
      const pathData = createPathData(currentPath);
      setPaths(prev => [...prev, pathData]);
      setCurrentPath([]);
    }
  };

  const createPathData = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return pathData;
  };

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath([]);
    if (onSignatureChange) {
      onSignatureChange(false);
    }
  };

  // Expose clear method via ref
  useImperativeHandle(ref, () => ({
    clearSignature,
  }));

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      runOnJS(setIsDrawing)(true);
      runOnJS(setCurrentPath)([]);
    },
    onActive: (event, context) => {
      const x = event.translationX + context.startX;
      const y = event.translationY + context.startY;
      
      translateX.value = x;
      translateY.value = y;
      
      runOnJS(addPoint)(x, y);
    },
    onEnd: () => {
      runOnJS(finishPath)();
      runOnJS(setIsDrawing)(false);
    },
  });

  return (
    <View style={[style, { backgroundColor }]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <Svg style={{ flex: 1 }}>
            <G>
              {/* Render completed paths */}
              {paths.map((pathData, index) => (
                <Path
                  key={`path-${index}`}
                  d={pathData}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              
              {/* Render current path being drawn */}
              {currentPath.length > 1 && (
                <Path
                  d={createPathData(currentPath)}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </G>
          </Svg>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

export default ExpoSignatureCanvas;
