import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Snackbar,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface DeepLink {
  platform: string;
  pattern: RegExp;
  deepLinkFormat: string;
}

const deepLinkPatterns: DeepLink[] = [
  {
    platform: 'YouTube',
    pattern: /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    deepLinkFormat: 'youtube'
  },
  {
    platform: 'Instagram',
    pattern: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/,
    deepLinkFormat: 'instagram'
  },
  {
    platform: 'Twitter',
    pattern: /^https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/,
    deepLinkFormat: 'twitter'
  }
];

const DeepLinkConverter: React.FC = () => {
  const [url, setUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const getRedirectUrl = (platform: string, id: string, webUrl: string) => {
    // Get the current domain
    const domain = window.location.origin;
    return `${domain}/redirect.html?platform=${platform}&id=${id}&web=${encodeURIComponent(webUrl)}`;
  };

  const convertToDeepLink = () => {
    for (const pattern of deepLinkPatterns) {
      const match = url.match(pattern.pattern);
      if (match) {
        if (pattern.platform === 'YouTube') {
          const videoId = match[4];
          const redirectUrl = getRedirectUrl('youtube', videoId, url);
          setConvertedUrl(
            `Smart Link (Copy & Share This):\n${redirectUrl}\n\n` +
            `This link will attempt to open YouTube app, then fall back to website if app is not installed.`
          );
          return;
        }
        const id = match[3];
        const redirectUrl = getRedirectUrl(pattern.platform.toLowerCase(), id, url);
        setConvertedUrl(
          `Smart Link (Copy & Share This):\n${redirectUrl}\n\n` +
          `This link will attempt to open the app, then fall back to website if app is not installed.`
        );
        return;
      }
    }
    setConvertedUrl('Unsupported URL format');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedUrl);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL to Deep Link Converter
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Enter URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              placeholder="https://youtube.com/watch?v=..."
            />
            <Button
              fullWidth
              variant="contained"
              onClick={convertToDeepLink}
              sx={{ mt: 2, mb: 2 }}
            >
              Convert to Deep Link
            </Button>
            {convertedUrl && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Deep Link"
                  variant="outlined"
                  value={convertedUrl}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={copyToClipboard}>
                        <ContentCopyIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard!"
      />
    </Container>
  );
};

export default DeepLinkConverter; 