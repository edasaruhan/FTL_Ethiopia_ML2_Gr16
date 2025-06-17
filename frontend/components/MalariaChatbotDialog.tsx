
// components/MalariaChatbotDialog.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Box, Typography, TextField, Button, Paper, CircularProgress,
  IconButton, Tooltip, Skeleton, Avatar, Dialog, DialogTitle,
  DialogContent, Link as MuiLink
} from '@mui/material'
import {
  Send as SendIcon, Mic as MicIcon, ContentCopy as CopyIcon, Close as CloseIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AxiosResponse } from 'axios'

interface ChatMessage {
  id: number | string
  role: 'user' | 'bot'
  query?: string
  response?: string
  search_urls?: string[]
  timestamp: string
}

interface MalariaChatbotDialogProps {
  open: boolean
  onClose: () => void
}

// Typing animation component
const TypingIndicator = () => {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return (
    <Typography variant="body2" sx={{ px: 2, py: 1, fontStyle: 'italic', color: '#4b5e5a' }}>
      Typing{dots}
    </Typography>
  )
}

const MalariaChatbotDialog: React.FC<MalariaChatbotDialogProps> = ({ open, onClose }) => {
  const [question, setQuestion] = useState('')
  const [isListening, setIsListening] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const {
    data: messages,
    isLoading: loadingHistory,
    error: queryError
  } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () =>
      api.get('/chatbot/messages/').then(res =>
        res.data.map((msg: any) => [
          { id: msg.id, role: 'user', query: msg.query, timestamp: new Date(msg.created_at).toLocaleString() },
          { id: msg.id, role: 'bot', response: msg.response, search_urls: msg.search_urls || [], timestamp: new Date(msg.created_at).toLocaleString() }
        ]).flat()
      )
  })

  const {
    mutate: sendQuery,
    isPending: isSending
  } = useMutation<AxiosResponse<any>, any, string>({
    mutationFn: (query) => api.post('/chatbot/messages/', { query }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] })
      setQuestion('')
    },
    onError: () => {
      queryClient.setQueryData(['chatMessages'], (old: ChatMessage[] | undefined) => [
        ...(old || []).filter(m => m.id !== 'typing'),
        {
          id: Date.now(),
          role: 'bot',
          response: `⚠️ Sorry, I couldn’t get a response at the moment.`,
          timestamp: new Date().toLocaleString(),
        }
      ])
    },
    onSettled: () => scrollToBottom(),
  })

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isSending) scrollToBottom()
  }, [messages, isSending])

  const handleAskQuestion = () => {
    if (!question.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      query: question,
      timestamp: new Date().toLocaleString(),
    }

    const loadingBotMessage = {
      id: 'typing',
      role: 'bot' as const,
      response: 'Typing...',
      timestamp: new Date().toLocaleString(),
    }

    queryClient.setQueryData(['chatMessages'], (old: ChatMessage[] | undefined) => [
      ...(old || []),
      userMessage,
      loadingBotMessage
    ])

    const currentQuestion = question
    setQuestion('')

    sendQuery(currentQuestion)
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    alert('Response copied to clipboard!')
  }

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuestion(transcript)
        handleAskQuestion()
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognition.start()
    } else {
      alert('Speech recognition is not supported in this browser.')
    }
  }

  if (queryError) {
    return (
      <Box p={2}>
        <Typography color="error">
          Failed to load chat history: {queryError.message}
        </Typography>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="malaria-chatbot-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: { xs: '95%', sm: 850 },
          height: { xs: '80%', sm: 750 },
          maxWidth: 'none',
          m: 0,
          bgcolor: '#ffffff',
          borderRadius: 2,
          boxShadow: 24,
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#00695c', color: '#e6f0fa', p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#1a3c34', mr: 1 }}>M</Avatar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Malaria Assistant
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#e6f0fa' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box flex={1} overflow="auto" p={2} bgcolor="#f5f5f5">
          {loadingHistory ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="70%" height={60} sx={{ mb: 2, borderRadius: 2 }} />
            ))
          ) : (
            messages?.map((msg: ChatMessage) => (
              <motion.div
                key={msg.id + msg.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box display="flex" flexDirection="column" alignItems={msg.role === 'user' ? 'flex-end' : 'flex-start'} mb={2}>
                  {msg.response === 'Typing...' ? (
                    <TypingIndicator />
                  ) : (
                    <Paper
                      sx={{
                        maxWidth: '100%',
                        p: 2,
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        bgcolor: msg.role === 'user' ? '#00695c' : '#e6f0fa',
                        color: msg.role === 'user' ? '#e6f0fa' : '#4b5e5a',
                        position: 'relative',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {msg.query ? (
                        <Typography variant="body2">{msg.query}</Typography>
                      ) : (
                        <ReactMarkdown
                          children={msg.response || ''}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            strong: ({ children }) => (
                              <strong style={{ color: '#004d40' }}>{children}</strong>
                            ),
                            a: ({ href, children }) => (
                              <MuiLink
                                href={href || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: '#00695c',
                                  textDecoration: 'underline',
                                  '&:hover': { color: '#004d40' }
                                }}
                              >
                                {children}
                              </MuiLink>
                            ),
                            li: ({ children }) => (
                              <li style={{ marginBottom: '4px', paddingLeft: '0.5rem' }}>{children}</li>
                            ),
                            p: ({ children }) => (
                              <Typography
                                variant="body2"
                                sx={{ color: '#4b5e5a', mb: 1, lineHeight: 1.7 }}
                              >
                                {children}
                              </Typography>
                            )
                          }}
                        />
                      )}
                      {msg.role === 'bot' && (
                        <Tooltip title="Copy Response">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyContent(msg.response || '')}
                            sx={{ position: 'absolute', top: 4, right: 4, color: '#00695c' }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Paper>
                  )}
                  <Typography variant="caption" color="#4b5e5a" mt={1}>
                    {msg.timestamp}
                  </Typography>
                </Box>
              </motion.div>
            ))
          )}
          <div ref={chatEndRef} />
        </Box>

        <Box p={2} borderTop="1px solid #e6f0fa" bgcolor="#fff">
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Ask about malaria..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSending) {
                  handleAskQuestion()
                  e.preventDefault()
                }
              }}
              disabled={isSending}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={startListening} disabled={isListening}>
                    {isListening ? '🎙️' : <MicIcon />}
                  </IconButton>
                )
              }}
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!question.trim() || isSending}
              variant="contained"
              sx={{ bgcolor: '#00695c', '&:hover': { bgcolor: '#004d40' } }}
            >
              {isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default MalariaChatbotDialog
