import HexDots from './HexDots';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.css';

// Need to wait for dom to size dot grid
document.addEventListener('DOMContentLoaded', function(e){
	const game = new HexDots();
});
