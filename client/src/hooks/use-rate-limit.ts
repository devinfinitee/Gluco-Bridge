/**
 * Hook for handling rate limit errors and feedback
 * Provides UI components and utilities for rate limiting
 */

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { visionLimiter, chatLimiter, getTimeUntilReset } from '@/lib/rateLimiter';

export interface RateLimitState {
  isLimited: boolean;
  remaining: number;
  retryAfter: number;
  type: 'vision' | 'chat' | 'none';
}

/**
 * Hook for monitoring rate limits
 */
export function useRateLimit() {
  const [visionStatus, setVisionStatus] = useState(() =>
    visionLimiter.getStatus('glucometer')
  );
  const [chatStatus, setChatStatus] = useState(() =>
    chatLimiter.getStatus('chat')
  );
  const { toast } = useToast();

  const checkVisionLimit = useCallback(() => {
    const status = visionLimiter.getStatus('glucometer');
    setVisionStatus(status);
    return status;
  }, []);

  const checkChatLimit = useCallback(() => {
    const status = chatLimiter.getStatus('chat');
    setChatStatus(status);
    return status;
  }, []);

  const showRateLimitWarning = useCallback(
    (type: 'vision' | 'chat') => {
      const status = type === 'vision' ? visionStatus : chatStatus;

      if (status.isLimited) {
        toast({
          title: '⏱️ Rate Limit Reached',
          description: `Please wait ${status.retryAfter} seconds before trying again.`,
          variant: 'destructive',
        });
        return false;
      }

      // Show warning if getting close to limit
      if (status.remaining <= 1) {
        toast({
          title: '⚠️ Rate Limit Warning',
          description: `You have ${status.remaining} request${status.remaining !== 1 ? 's' : ''} remaining.`,
          variant: 'default',
        });
      }

      return true;
    },
    [visionStatus, chatStatus, toast]
  );

  const resetVisionLimit = useCallback(() => {
    visionLimiter.reset('glucometer');
    setVisionStatus(visionLimiter.getStatus('glucometer'));
  }, []);

  const resetChatLimit = useCallback(() => {
    chatLimiter.reset('chat');
    setChatStatus(chatLimiter.getStatus('chat'));
  }, []);

  return {
    visionStatus,
    chatStatus,
    checkVisionLimit,
    checkChatLimit,
    showRateLimitWarning,
    resetVisionLimit,
    resetChatLimit,
  };
}

/**
 * Hook for automatic rate limit monitoring with interval
 */
export function useRateLimitMonitor(intervalMs = 5000) {
  const { visionStatus, chatStatus, checkVisionLimit, checkChatLimit } =
    useRateLimit();

  const [monitoringActive, setMonitoringActive] = useState(false);

  const startMonitoring = useCallback(() => {
    setMonitoringActive(true);
    const interval = setInterval(() => {
      checkVisionLimit();
      checkChatLimit();
    }, intervalMs);

    return () => {
      clearInterval(interval);
      setMonitoringActive(false);
    };
  }, [checkVisionLimit, checkChatLimit, intervalMs]);

  return {
    visionStatus,
    chatStatus,
    monitoringActive,
    startMonitoring,
  };
}

/**
 * Get readable error message for rate limit
 */
export function getRateLimitMessage(
  remaining: number,
  retryAfter: number,
  isLimited: boolean
): string {
  if (isLimited) {
    if (retryAfter < 60) {
      return `Rate limit reached. Try again in ${retryAfter}s.`;
    }
    const minutes = Math.ceil(retryAfter / 60);
    return `Rate limit reached. Try again in ${minutes}m.`;
  }

  if (remaining === 0) {
    return 'No requests remaining. Please wait.';
  }

  if (remaining === 1) {
    return '⚠️ Only 1 request remaining!';
  }

  if (remaining <= 3) {
    return `⚠️ ${remaining} requests remaining`;
  }

  return '';
}

/**
 * Format countdown timer for rate limit reset
 */
export function formatCountdown(resetTime: number): string {
  const remaining = getTimeUntilReset(resetTime);

  if (remaining <= 0) {
    return 'Ready!';
  }

  if (remaining < 60) {
    return `${remaining}s remaining`;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}m ${seconds}s remaining`;
}

/**
 * Rate limit status display props
 */
export interface RateLimitStatusProps {
  remaining: number;
  isLimited: boolean;
  retryAfter: number;
  showWarning?: boolean;
}

/**
 * Get CSS class for rate limit indicator
 */
export function getRateLimitIndicatorClass(remaining: number, maxRequests: number = 10): string {
  const percentage = (remaining / maxRequests) * 100;

  if (percentage > 50) {
    return 'text-green-600';  // Good
  }
  if (percentage > 25) {
    return 'text-yellow-600';  // Warning
  }
  return 'text-red-600';  // Critical
}
