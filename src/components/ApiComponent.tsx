import { TailSpin } from "react-loader-spinner";

interface ApiComponentProps {
  loading: boolean | undefined;
  error: Error | undefined;
  children: React.ReactNode;
}

export const ApiComponent = ({
  loading,
  error,
  children,
}: ApiComponentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <TailSpin />
      </div>
    );
  } else if (error) {
    return <span>Erro ao buscar eventos!</span>;
  } else {
    return children;
  }
};
