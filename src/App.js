import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloudIcon from '@material-ui/icons/Cloud';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

const Copyright = () => {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Created by '}
      <Link color='inherit' href='https://github.com/mdmundo'>
        Edmundo Paulino
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  upper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800]
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(6)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  search: {
    display: 'flex'
  },
  input: {
    marginLeft: theme.spacing(1.5),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  grid: {
    paddingTop: theme.spacing(1.5)
  },
  depositContext: {
    flex: 1
  }
}));

const App = () => {
  const [address, setAddress] = useState('');
  const [temperature, setTemperature] = useState({
    value: undefined,
    units: undefined
  });
  const [moonPhase, setMoonPhase] = useState({ value: undefined });
  const [sunset, setSunset] = useState({ value: undefined });
  const [sunrise, setSunrise] = useState({ value: undefined });
  const [humidity, setHumidity] = useState({
    value: undefined,
    units: undefined
  });

  const useLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const { data: forecast } = await axios.get(
          `https://api.climacell.co/v3/weather/realtime?unit_system=si&apikey=sGBGNcAnaxVc8aNVwHRDMPnspYxhTdW3&lat=${lat}&lon=${lon}&fields=moon_phase,surface_shortwave_radiation,visibility,sunset,sunrise,humidity,dewpoint,feels_like,temp,wind_speed,fire_index`
        );

        setTemperature(forecast.temp);
        setHumidity(forecast.humidity);
        setMoonPhase(forecast.moon_phase);
        setSunrise(forecast.sunrise);
        setSunset(forecast.sunset);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    );
  };

  const searchAddress = async (e) => {
    e.preventDefault();
    if (address.length < 4) return;

    const { data: location } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoibWRtdW5kbyIsImEiOiJjazdkYmUwOGgxbnBlM2ZudTU0ajM1OHhrIn0.hOVUTlxOg_sIww36kjeBiw&limit=1`
    );

    const lat = location.features[0].geometry.coordinates[1];
    const lon = location.features[0].geometry.coordinates[0];

    const { data: forecast } = await axios.get(
      `https://api.climacell.co/v3/weather/realtime?unit_system=si&apikey=sGBGNcAnaxVc8aNVwHRDMPnspYxhTdW3&lat=${lat}&lon=${lon}&fields=moon_phase,surface_shortwave_radiation,visibility,sunset,sunrise,humidity,dewpoint,feels_like,temp,wind_speed,fire_index`
    );

    setTemperature(forecast.temp);
    setHumidity(forecast.humidity);
    setMoonPhase(forecast.moon_phase);
    setSunrise(forecast.sunrise);
    setSunset(forecast.sunset);

    setAddress('');
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component='main' className={classes.main} maxWidth='xs'>
        <div className={classes.upper}>
          <Avatar className={classes.avatar}>
            <CloudIcon />
          </Avatar>
          <Typography component='h1' variant='h3'>
            Weather
          </Typography>
          <form className={classes.form} onSubmit={searchAddress} noValidate>
            <Paper className={classes.search}>
              <InputBase
                value={address}
                id='address'
                name='address'
                onChange={(e) => setAddress(e.target.value)}
                className={classes.input}
                placeholder='Search Address'
              />
              <IconButton
                type='submit'
                className={classes.iconButton}
                aria-label='search'>
                <SearchIcon />
              </IconButton>
            </Paper>
          </form>
          <Button
            onClick={useLocation}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}>
            Use my current location
          </Button>
        </div>
        <Grid item className={classes.grid}>
          <Paper className={classes.paper}>
            <div>
              <Typography component='p' variant='h2'>
                {temperature.value
                  ? `${temperature.value} º${temperature.units}`
                  : '... ºC'}
              </Typography>
              <Typography
                component='p'
                variant='caption'
                color='textSecondary'
                className={classes.depositContext}>
                {humidity.value
                  ? `Humidity is ${humidity.value}${humidity.units}.`
                  : 'Humidity...'}
              </Typography>
              <Typography
                component='p'
                variant='caption'
                color='textSecondary'
                className={classes.depositContext}>
                {moonPhase.value
                  ? `Moon phase is ${moonPhase.value}.`
                  : 'Moon phase...'}
              </Typography>
              <Typography
                component='p'
                variant='caption'
                color='textSecondary'
                className={classes.depositContext}>
                {sunrise.value
                  ? `Sunrise ${
                      moment(sunrise.value).diff(moment()) < 0
                        ? 'was'
                        : 'will be'
                    } ${moment(sunrise.value).fromNow()}. Exactly at ${moment(
                      sunrise.value
                    ).format('HH:mm:ss')}.`
                  : 'Sunrise...'}
              </Typography>
              <Typography
                component='p'
                variant='caption'
                color='textSecondary'
                className={classes.depositContext}>
                {sunset.value
                  ? `Sunset ${
                      moment(sunset.value).diff(moment()) < 0
                        ? 'was'
                        : 'will be'
                    } ${moment(sunset.value).fromNow()}. Exactly at ${moment(
                      sunset.value
                    ).format('HH:mm:ss')}.`
                  : 'Sunset...'}
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth='xs'>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
};

export default App;
