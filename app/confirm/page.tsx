type SearchParamsProps = {
  searchParams: {
    message: string;
  };
};

const ConfirmEmail = ({ searchParams }: SearchParamsProps) => {
    return <div className="w-full max-w-md mx-auto px-4 py-32">
        {searchParams.message && (
            <p className='text-green-500 bg-green-500/10 rounded-lg p-3 my-2 text-sm text-center'>
                {searchParams.message}
            </p>
        )}
  </div>;
};

export default ConfirmEmail;
