import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import jsmediatags from 'jsmediatags';
import { calculateTLRevenue } from '@/utils/tlCalculator';

export const useTLAgent = () => {
  const [conversionQueue, setConversionQueue] = useState([]);
  const [userBalance, setUserBalance] = useState(10000);
  const [isAgentActive, setIsAgentActive] = useState(true);

  const convertToTLMP3 = useCallback(async (file, settings) => {
    const jobId = uuidv4();
    
    // 큐에 작업 추가
    const job = {
      id: jobId,
      file: file.name,
      status: 'processing',
      progress: 0,
      settings
    };
    
    setConversionQueue(prev => [...prev, job]);

    // ID3 태그 분석
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          // ID3 태그에 TL 정보 추가
          const tlInfo = {
            ...settings,
            agentId: `TLAG_${Date.now().toString(16).toUpperCase()}`,
            originalTags: tag.tags,
            fileSize: file.size,
            duration: tag.tags.duration || 0
          };

          // 변환 진행 시뮬레이션
          const interval = setInterval(() => {
            setConversionQueue(prev => 
              prev.map(j => 
                j.id === jobId 
                  ? { ...j, progress: Math.min(j.progress + 10, 100) }
                  : j
              )
            );
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            
            // 변환 완료
            const completedJob = {
              ...job,
              status: 'completed',
              progress: 100,
              result: {
                tlInfo,
                downloadUrl: URL.createObjectURL(file),
                metadata: JSON.stringify(tlInfo, null, 2)
              }
            };
            
            setConversionQueue(prev => 
              prev.map(j => j.id === jobId ? completedJob : j)
            );
            
            resolve(completedJob);
          }, 2000);
        },
        onError: (error) => {
          console.error('ID3 태그 읽기 실패:', error);
          reject(new Error('MP3 파일 분석 실패'));
        }
      });
    });
  }, []);

  const consumeTL = useCallback((tlAmount, revenueDistribution) => {
    if (!isAgentActive) return false;
    
    if (userBalance >= tlAmount) {
      setUserBalance(prev => prev - tlAmount);
      
      // 수익 분배 계산
      const revenue = calculateTLRevenue(tlAmount, revenueDistribution);
      
      // 수익 분배 이벤트 발생 (실제로는 API 호출)
      console.log('TL 소비 및 수익 분배:', revenue);
      
      return { success: true, remaining: userBalance - tlAmount, revenue };
    }
    
    return { success: false, remaining: userBalance };
  }, [userBalance, isAgentActive]);

  const addTLBalance = useCallback((amount) => {
    setUserBalance(prev => prev + amount);
    return userBalance + amount;
  }, [userBalance]);

  const toggleAgent = useCallback((active) => {
    setIsAgentActive(active);
    return active;
  }, []);

  return {
    conversionQueue,
    userBalance,
    isAgentActive,
    convertToTLMP3,
    consumeTL,
    addTLBalance,
    toggleAgent,
    setConversionQueue
  };
};
