import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const Services=()=>{
    return (
        <Card sx={{ maxWidth: '18rem' }}>
        <CardMedia
          component="img"
          height="140"
          image="/services.png"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Display Name
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    )
}