import { Toolbar} from 'react-onsenui';

const NavBar = ({ title }: {title: string}) => {
  return (
    <Toolbar style={{background: '#004898'}}>
      <div style={{color: '#ffffff'}} className='center'>{title}</div>
    </Toolbar>
  )
}

export default NavBar;