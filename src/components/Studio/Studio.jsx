import React, { useState } from 'react';
import styled from 'styled-components';
import UploadZone from './UploadZone';
import TLMPSettings from './TLMPSettings';
import ConversionQueue from './ConversionQueue';
import { useTLAgent } from '@/hooks/useTLAgent';
import { toast } from 'react-hot-toast';

const StudioContainer = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ConversionSidebar = styled.div`
  background: linear-gradient(145deg, #1E293B, #0F172A);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(255, 107, 0, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const Workspace = styled.div`
  background: linear-gradient(145deg, #1E293B, #0F172A);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(0, 212, 170, 0.3);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Studio = () => {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [settings, setSettings] = useState({
    title: '',
    artist: '',
    tlAmount: 3600,
    tlRate: 1,
    copyrightEmail: '',
    revenueDistribution: { copyright: 50, uploader: 20, platform: 30 }
  });
  
  const { convertToTLMP3, conversionQueue } = useTLAgent();

  const handleFileUpload = (uploadedFiles) => {
    setFiles(prev => [...prev, ...uploadedFiles]);
    if (!currentFile && uploadedFiles.length > 0) {
      setCurrentFile(uploadedFiles[0]);
      setSettings(prev => ({
        ...prev,
        title: uploadedFiles[0].name.replace('.mp3', ''),
        artist: 'Unknown Artist'
      }));
    }
    toast.success(`${uploadedFiles.length}개의 파일이 업로드되었습니다.`);
  };

  const handleConvert = async () => {
    if (!currentFile) {
      toast.error('변환할 파일을 선택하세요.');
      return;
    }

    try {
      const result = await convertToTLMP3(currentFile, settings);
      toast.success('TL-MP3 변환 성공!');
      console.log('변환 결과:', result);
    } catch (error) {
      toast.error('변환 실패: ' + error.message);
    }
  };

  return (
    <StudioContainer>
      <ConversionSidebar>
        <div className="sidebar-header">
          <div className="studio-icon">
            <i className="fas fa-microchip"></i>
          </div>
          <h1 className="sidebar-title">TL-AGENT STUDIO</h1>
          <p className="sidebar-subtitle">기존 MP3에 TL 소비 시스템 통합</p>
        </div>

        <UploadZone onFileUpload={handleFileUpload} />
        
        {currentFile && (
          <div className="file-info active">
            <div className="file-details">
              <div className="file-icon">
                <i className="fas fa-music"></i>
              </div>
              <div className="file-meta">
                <h4>{currentFile.name}</h4>
                <p>{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <audio 
              className="audio-preview" 
              controls 
              src={URL.createObjectURL(currentFile)}
            />
          </div>
        )}

        <TLMPSettings 
          settings={settings} 
          onChange={setSettings} 
        />

        <button className="btn btn-primary" onClick={handleConvert}>
          <i className="fas fa-bolt"></i>
          TL-MP3 변환 시작
        </button>
      </ConversionSidebar>

      <Workspace>
        <div className="workspace-header">
          <h2 className="workspace-title">작업 대시보드</h2>
          <div className="queue-status">
            대기 중: {conversionQueue.filter(q => q.status === 'queued').length}개
          </div>
        </div>

        <ConversionQueue queue={conversionQueue} />
        
        <div className="agent-architecture">
          <h3>TL-AGENT 작동 흐름</h3>
          <div className="architecture-flow">
            {/* 아키텍처 흐름도 구현 */}
          </div>
        </div>
      </Workspace>
    </StudioContainer>
  );
};

export default Studio;
