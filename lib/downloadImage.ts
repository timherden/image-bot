/**
 * Helper function to download a base64 image
 */
export function downloadImage(base64Image: string, filename: string = 'generated-image.png') {
  // Create a link element
  const link = document.createElement('a');
  
  // Set the download attribute with the desired filename
  link.download = filename;
  
  // Set the href to the base64 image data
  link.href = base64Image.startsWith('data:') 
    ? base64Image 
    : `data:image/png;base64,${base64Image}`;
  
  // Append the link to the body
  document.body.appendChild(link);
  
  // Trigger a click event on the link to start the download
  link.click();
  
  // Remove the link from the body
  document.body.removeChild(link);
}