import { useCallback, useState } from 'react';

export function useTransactionSubmission() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSubmission = useCallback((hash) => {
    setTxHash(hash);
    setShowConfirm(true);
  }, []);

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setTxHash('');
  }, [txHash]);

  return {
    showConfirm,
    attemptingTxn,
    setAttemptingTxn,
    txHash,
    handleSubmission,
    handleDismissConfirmation,
  };
}
