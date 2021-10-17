import { Toolbar, BackButton } from 'react-onsenui';

const NavBar = ({
    title, 
    barTextColor, 
    barBackgroundColor, 
    hasBackButton
  } : {
    title :string, 
    barTextColor: string, 
    barBackgroundColor: string, 
    hasBackButton: boolean
  }
  ) => {
  return (
    hasBackButton ? 
    <Toolbar style={{background: barBackgroundColor}}>
      <div className='left'><BackButton>Back</BackButton></div>
      <div className='center' style={{color: barTextColor}} >{title}</div>
    </Toolbar>
    :
    <Toolbar style={{background: barBackgroundColor}}>
      <div style={{color: barTextColor}} className='center'>{title}</div>
    </Toolbar>
  )
}

export default NavBar;