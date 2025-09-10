import { useState, useEffect, useCallback } from 'react'

interface AudioDetectionOptions {
  threshold?: number
  sensitivity?: number
  cooldown?: number
}

export function useAudioDetection(options: AudioDetectionOptions = {}) {
  const { threshold = 0.02, sensitivity = 1.5, cooldown = 1000 } = options
  const [isListening, setIsListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isBlowing, setIsBlowing] = useState(false)
  
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.8
      microphone.connect(analyser)
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let lastBlowTime = 0
      
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        
        // Calculate average amplitude
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        const normalizedLevel = average / 255
        
        // Also check low-frequency range (better for breath detection)
        const lowFreqData = dataArray.slice(0, 50) // First 50 bins (low frequencies)
        const lowFreqAverage = lowFreqData.reduce((sum, value) => sum + value, 0) / lowFreqData.length
        const lowFreqNormalized = lowFreqAverage / 255
        
        // Use higher of the two values for better mobile detection
        const detectionLevel = Math.max(normalizedLevel, lowFreqNormalized)
        
        setAudioLevel(detectionLevel)
        
        // Debug logging for mobile
        if (detectionLevel > 0.001) {
          console.log('Audio level:', detectionLevel.toFixed(4), 'Threshold needed:', (threshold * sensitivity).toFixed(4))
        }
        
        // Detect blow (sudden increase in audio level)
        const currentTime = Date.now()
        if (detectionLevel > threshold * sensitivity && currentTime - lastBlowTime > cooldown) {
          console.log('BLOW DETECTED! Level:', detectionLevel.toFixed(4))
          setIsBlowing(true)
          lastBlowTime = currentTime
          
          // Reset blow state after a short duration
          setTimeout(() => setIsBlowing(false), 500)
        }
        
        if (isListening) {
          requestAnimationFrame(checkAudioLevel)
        }
      }
      
      checkAudioLevel()
      setIsListening(true)
      
      return () => {
        stream.getTracks().forEach(track => track.stop())
        audioContext.close()
        setIsListening(false)
      }
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setIsListening(false)
    }
  }, [threshold, sensitivity, cooldown, isListening])
  
  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])
  
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [isListening, stopListening])
  
  return {
    startListening,
    stopListening,
    isListening,
    audioLevel,
    isBlowing
  }
}