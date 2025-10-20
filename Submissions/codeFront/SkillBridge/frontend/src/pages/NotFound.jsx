import {Link} from 'react-router-dom'
const NotFound = () => {
  return (
    <div className='w-full h-screen flex flex-col space-y-4 justify-center items-center'>
        <h1 className='text-xl '>404, Page Not Found</h1>
        <Link to={"/"} className="btn-primary">Go To Home</Link>
    </div>
  )
}

export default NotFound